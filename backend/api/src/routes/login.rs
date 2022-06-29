use crate::DBPool;
use crate::{model::NewUser::NewUser, model::User::User, schema::users};
use diesel::prelude::*;
use diesel::{connection, PgConnection, QueryDsl, RunQueryDsl};
use jsonwebtoken::{encode, EncodingKey, Header};
use rocket::{
    futures::lock::Mutex,
    serde::{json::Json, Deserialize},
    State,
};
use serde::Serialize;
use std::time::{SystemTime, UNIX_EPOCH};

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};

use super::types::{ErrorResponse, Response};
use rocket::response::status;

#[post("/register", format = "json", data = "<register>")]
pub async fn register(connection: DBPool, register: Json<Register>) {
    let salt = SaltString::generate(&mut OsRng); // generate salt

    let argon2 = Argon2::default();

    let password_hash = match argon2.hash_password(&register.password.clone().into_bytes(), &salt) {
        Ok(mk_hash) => mk_hash,
        Err(_) => panic!("failed to hash password"),
    };

    let new_user = NewUser {
        username: register.username.clone(),
        password: password_hash.to_string(),
    };

    connection
        .run(move |c| {
            diesel::insert_into(users::table)
                .values(&new_user)
                .execute(c)
        })
        .await
        .expect("failed to create new user");
}

#[post("/login", format = "json", data = "<login>")]
pub async fn login(
    connection: DBPool,
    login: Json<Login>,
) -> Result<Json<Response<String>>, status::Unauthorized<Json<ErrorResponse<String>>>> {
    let username = login.username.clone();

    let user: User = connection
        .run(move |c| users::table.filter(users::username.eq(username)).first(c))
        .await
        .expect("failed to get user!");

    let argon2 = Argon2::default();

    let parsed_hash = PasswordHash::new(&user.password).unwrap();

    if !argon2
        .verify_password(&login.password.clone().as_bytes(), &parsed_hash)
        .is_ok()
    {
        return Err(status::Unauthorized(Some(Json(ErrorResponse {
            success: false,
            err: "Invalid username or password".into(),
        }))));
    }

    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");

    let key = dotenv!("JWT_KEY");

    let claims = Claims {
        exp: (since_the_epoch.as_secs() + 86400) as usize,
        username: login.username.clone(),
    };

    let token = match encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(key.as_bytes()),
    ) {
        Ok(t) => t,
        Err(e) => {
            return Err(status::Unauthorized(Some(Json(ErrorResponse {
                success: false,
                err: "Login failed".into(),
            }))))
        }
    };

    let response = Json(Response {
        success: true,
        message: "Login successful!".into(),
        data: token,
    });

    Ok(response)
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Login {
    username: String,
    password: String,
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Register {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    username: String,
    exp: usize,
}

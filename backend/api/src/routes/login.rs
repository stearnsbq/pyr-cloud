use rocket::{serde::{Deserialize, json::Json}, State, futures::lock::Mutex};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::Serialize;


use super::types::{Response, ErrorResponse};
use rocket::response::status;



#[post("/", data = "<login>")]
pub fn login(login: Json<Login<'_>>) -> Result<Json<Response<String>>,  status::Unauthorized<Json<ErrorResponse<&'static str>>>> {

    let key = dotenv!("JWT_KEY");

    let claims = Claims {
        exp: 86400000,
    };

    let token = match encode(&Header::default(), &claims, &EncodingKey::from_secret(key.as_bytes())) {
        Ok(t) => t,
        Err(e) => return Err(status::Unauthorized(Some(Json(
            ErrorResponse{
                success: false,
                err: "Login failed"
            }
        )))),
    };

    
    let response = Json(
        Response{
            success: true,
            message: "Login successful!".into(),
            data: token
        }
    );


    Ok(response)
}




#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Login<'r>{
    username: &'r str,
    password: &'r str
}


#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    exp: usize,
}
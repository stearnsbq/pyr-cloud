pub mod routes;
pub mod model;
pub mod schema;

#[macro_use] extern crate diesel;
#[macro_use] extern crate rocket;
#[macro_use] extern crate dotenv_codegen;

extern crate dotenv;

use routes::login::{login, register};
use routes::gateway::{get_resources, new_resource};
use dotenv::dotenv;
use rocket_sync_db_pools::database;
use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions};




#[database("pyr_cloud")]
pub struct DBPool(diesel::PgConnection);

#[launch]
fn rocket() -> _ {
    dotenv().ok();  

    let cors = CorsOptions::default()
    .allowed_origins(AllowedOrigins::all())
    .allowed_methods(
        vec![Method::Get, Method::Post, Method::Patch]
            .into_iter()
            .map(From::from)
            .collect(),
    )
    .allow_credentials(true)
    .to_cors().unwrap();

    rocket::build()
    .attach(DBPool::fairing())
    .attach(cors)
    .mount("/", routes![])
    .mount("/auth", routes![login, register])
    .mount("/gateway", routes![get_resources, new_resource])

}
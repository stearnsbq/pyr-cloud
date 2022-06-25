pub mod routes;
pub mod model;
pub mod schema;

#[macro_use] extern crate diesel;
#[macro_use] extern crate rocket;
#[macro_use] extern crate dotenv_codegen;

extern crate dotenv;

use routes::login::{login, register};
use dotenv::dotenv;
use rocket_sync_db_pools::database;

#[database("pyr_cloud")]
pub struct DBPool(diesel::PgConnection);

#[launch]
fn rocket() -> _ {
    dotenv().ok();  

    rocket::build()
    .attach(DBPool::fairing())
    .mount("/", routes![])
    .mount("/auth", routes![login, register])

}
pub mod routes;
pub mod model;

#[macro_use] extern crate diesel;
#[macro_use] extern crate rocket;
#[macro_use] extern crate dotenv_codegen;

extern crate dotenv;
use std::sync::Mutex;


use routes::login::{login};
use dotenv::dotenv;
use rocket_sync_db_pools::database;

#[database("pyr-cloud")]
pub struct DBPool(diesel::PgConnection);

#[launch]
fn rocket() -> _ {
    dotenv().ok();  

    rocket::build()
    .attach(DBPool::fairing())
    .mount("/", routes![])
    .mount("/login", routes![login])

}
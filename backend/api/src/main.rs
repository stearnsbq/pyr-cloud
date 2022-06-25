pub mod routes;
pub mod model;

#[macro_use] extern crate rocket;
#[macro_use] extern crate dotenv_codegen;
#[macro_use] extern crate rocket_contrib;

extern crate dotenv;
use std::sync::Mutex;


use routes::login::{login};
use dotenv::dotenv;
use rocket_contrib::databases::diesel;

#[database("sqlite_logs")]
pub struct DBPool(diesel::PgConnection);

#[launch]
fn rocket() -> _ {
    dotenv().ok();  

    rocket::build()
    .mount("/", routes![])
    .mount("/login", routes![login])
    .attach(DBPool::fairing())
}
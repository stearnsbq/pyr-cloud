
use std::any;

use rocket::serde::json::Json;
use serde::Deserialize;

use crate::{DBPool};
use crate::model::NewResource::NewResource;

#[get("/resources")]
pub async fn get_resources(connection: DBPool){

 //   connection.run()

}

#[post("/resource", format="json", data="<resource>")]
pub async fn new_resource(connection: DBPool, resource: Json<NewResource>){

}





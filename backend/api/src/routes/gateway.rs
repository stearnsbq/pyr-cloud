
use std::any;

use crate::DBPool;


#[get("/resources")]
pub async fn get_resources(connection: DBPool){

 //   connection.run()

}

#[post("/resource", format="json", data="<resource>")]
pub async fn new_resource(connection: DBPool, resource: any){

}




#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Resource {
    username: String,
    password: String,
}
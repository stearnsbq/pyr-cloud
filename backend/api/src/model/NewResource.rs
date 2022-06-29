use serde::Deserialize;
use crate::schema::resource;

#[derive(Deserialize, Insertable)]
#[serde(crate = "rocket::serde")]
#[table_name="resource"]
pub struct NewResource {
    route: String,
    method: String,
    parent: Option<i32>
}
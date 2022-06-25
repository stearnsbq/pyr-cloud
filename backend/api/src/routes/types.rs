use rocket::{serde::{Serialize, json::Json}, response::status};


#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Response<T>{
    pub success: bool,
    pub message: String,
    pub data: T
}


#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ErrorResponse<T>{
    pub success: bool,
    pub err: T
}





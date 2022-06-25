use crate::schema::users;

#[derive(Insertable)]
#[table_name="users"]
pub struct NewUser {
    pub username: String,
    pub password: String,
}
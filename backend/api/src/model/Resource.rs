
#[derive(Queryable)]
pub struct Resource{
    pub id: i32,
    pub route: String,
    pub parent: i32,
    pub function: i32,
    pub method: String
}
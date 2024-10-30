use diesel::prelude::*;
use serde::Deserialize;

use crate::schema::entries;

#[derive(Queryable, serde::Serialize)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parentid: Option<i32>,
}

#[derive(Deserialize, Insertable)]
#[table_name = "entries"]
pub struct NewEntry {
    pub title: String,
    pub parentid: Option<i32>,
}

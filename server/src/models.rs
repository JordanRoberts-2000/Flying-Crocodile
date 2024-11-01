use async_graphql::{InputObject, SimpleObject};
use diesel::prelude::*;
use serde::Deserialize;

use crate::schema::entries;

#[derive(Queryable, serde::Serialize, SimpleObject)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parent_id: Option<i32>,
    pub is_folder: bool,
}

#[derive(Deserialize, Insertable, InputObject)]
#[table_name = "entries"]
pub struct NewEntry {
    pub title: String,
    pub parent_id: Option<i32>,
    pub is_folder: bool,
}

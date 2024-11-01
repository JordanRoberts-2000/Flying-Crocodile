use async_graphql::{InputObject, SimpleObject};
use diesel::prelude::*;
use serde::Deserialize;

use crate::schema::entries;

#[derive(Queryable, serde::Serialize, SimpleObject)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parentid: Option<i32>,
}

#[derive(Deserialize, Insertable, InputObject)]
#[table_name = "entries"]
pub struct NewEntry {
    pub title: String,
    pub parentid: Option<i32>,
}

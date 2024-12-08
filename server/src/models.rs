use async_graphql::{InputObject, SimpleObject};
use diesel::prelude::*;
use serde::Deserialize;
use std::collections::HashMap;

use crate::schema::entries;

#[derive(Queryable, serde::Serialize, SimpleObject, Clone, Debug)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parent_id: Option<i32>,
    pub is_folder: bool,
}

#[derive(Deserialize, Insertable, InputObject)]
#[diesel(table_name = entries)]
pub struct NewEntry {
    pub title: String,
    pub parent_id: Option<i32>,
    pub is_folder: bool,
}

#[derive(SimpleObject)]
pub struct InitialEntriesResponse {
    pub root_id: i32,
    pub initial_entries: HashMap<i32, Entry>,
}

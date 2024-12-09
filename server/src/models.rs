use async_graphql::{InputObject, SimpleObject};
use diesel::prelude::*;
use serde::Deserialize;
use validator::Validate;

use crate::schema::entries;

#[derive(Queryable, serde::Serialize, SimpleObject, Clone, Debug)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parent_id: Option<i32>,
    pub root_id: Option<i32>,
    pub is_folder: bool,
}

#[derive(SimpleObject)]
pub struct MinimalEntry {
    pub id: i32,
    pub title: String,
    pub is_folder: bool,
}

#[derive(Deserialize, Insertable, InputObject)]
#[diesel(table_name = entries)]
pub struct NewEntry {
    pub title: String,
    pub parent_id: Option<i32>,
    pub root_id: Option<i32>,
    pub is_folder: bool,
}

#[derive(InputObject, Validate)]
pub struct FolderQueryInput {
    #[validate(length(min = 1, message = "Root title must not be empty"))]
    pub root_title: String,
    pub folder_id: Option<i32>,
}

#[derive(SimpleObject)]
pub struct FolderQueryResponse {
    pub folder_id: i32,
    pub entries: Vec<MinimalEntry>,
}

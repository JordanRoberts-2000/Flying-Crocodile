use async_graphql::InputObject;
use diesel::prelude::*;
use serde::Deserialize;
use validator::Validate;

use crate::schema::entries;

#[derive(InputObject, Validate)]
pub struct GetEntriesInput {
    #[validate(length(min = 1, message = "Root title must not be empty"))]
    pub root_title: String,
    pub folder_id: Option<i32>,
}

#[derive(Deserialize, InputObject, Debug)]
pub struct CreateEntryInput {
    pub title: String,
    pub parent_id: i32,
    pub is_folder: bool,
    pub root_title: String,
}

#[derive(Deserialize, Insertable, Debug)]
#[diesel(table_name = entries)]
pub struct NewEntry {
    pub title: String,
    pub parent_id: Option<i32>,
    pub root_id: Option<i32>,
    pub is_folder: bool,
}

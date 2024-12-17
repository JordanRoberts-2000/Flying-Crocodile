use async_graphql::InputObject;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::schema::entries;

#[derive(InputObject, Validate, Serialize)]
pub struct GetEntriesInput {
    #[validate(length(min = 1, message = "Root title must not be empty"))]
    pub root_title: String,
    pub folder_id: Option<i32>,
}

#[derive(Deserialize, Serialize, InputObject, Debug)]
pub struct CreateEntryInput {
    pub title: String,
    pub parent_id: Option<i32>,
    pub is_folder: bool,
    pub root_title: Option<String>,
}

#[derive(InputObject, Serialize)]
pub struct DeleteEntryInput {
    pub entry_id: Option<i32>,
    pub root_title: String,
}

#[derive(InputObject, Serialize)]
pub struct MoveEntryInput {
    pub entry_id: i32,
    pub new_parent_id: i32,
}

#[derive(InputObject, Serialize)]
pub struct RenameEntryInput {
    pub entry_id: Option<i32>,
    pub root_title: String,
    pub new_title: String,
}

#[derive(Deserialize, Insertable, Debug)]
#[diesel(table_name = entries)]
pub struct NewEntry {
    pub title: String,
    pub parent_id: Option<i32>,
    pub root_id: Option<i32>,
    pub is_folder: bool,
}

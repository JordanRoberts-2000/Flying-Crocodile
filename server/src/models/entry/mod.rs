pub mod inputs;
pub mod outputs;

use async_graphql::SimpleObject;
use diesel::prelude::*;

use crate::schema::entries;

use super::NewEntry;

#[derive(Queryable, serde::Serialize, SimpleObject, Clone, Debug)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub parent_id: Option<i32>,
    pub root_id: Option<i32>,
    pub is_folder: bool,
}

impl Entry {
    pub fn create_root(connection: &mut PgConnection, root_name: &str) -> Result<Self, String> {
        let new_entry = NewEntry {
            title: root_name.to_string(),
            parent_id: None,
            root_id: None,
            is_folder: true,
        };

        diesel::insert_into(entries::table)
            .values(&new_entry)
            .returning(entries::all_columns)
            .get_result::<Entry>(connection)
            .map_err(|e| {
                format!(
                    "Error inserting root entry `{}` into the database: {}",
                    root_name, e
                )
            })
    }
}

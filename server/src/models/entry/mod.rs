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
    pub fn create_root(conn: &mut PgConnection, root_name: &str) -> Result<Self, String> {
        let new_entry = NewEntry {
            title: root_name.to_string(),
            parent_id: None,
            root_id: None,
            is_folder: true,
        };

        diesel::insert_into(entries::table)
            .values(&new_entry)
            .returning(entries::all_columns)
            .get_result::<Entry>(conn)
            .map_err(|e| {
                format!(
                    "Error inserting root entry `{}` into the database: {}",
                    root_name, e
                )
            })
    }

    pub fn create_index(conn: &mut PgConnection, root_id: i32) -> Result<String, String> {
        let index_name = format!("idx_entries_by_root_id_{}", root_id);
        let create_index_query = format!(
            "CREATE INDEX {} ON entries (parent_id) WHERE root_id = {};",
            index_name, root_id
        );

        diesel::sql_query(create_index_query)
            .execute(conn)
            .map_err(|e| format!("Failed to create index for root_id {}: {}", root_id, e))?;

        Ok(index_name)
    }
}

use crate::{models::NewEntry, schema::entries};
use diesel::prelude::*;
use log::info;

use super::RootManager;

impl RootManager {
    pub fn create_root(&self, root_name: &str) -> Result<(), String> {
        let mut connection = self.db_pool.get().map_err(|e| {
            format!(
                "Failed to get DB connection from pool while creating entry `{}`: {}",
                root_name, e
            )
        })?;

        let new_entry = NewEntry {
            title: root_name.to_string(),
            parent_id: None,
            root_id: None,
            is_folder: true,
        };

        let inserted_root_id: i32 = diesel::insert_into(entries::table)
            .values(&new_entry)
            .returning(entries::id)
            .get_result(&mut connection)
            .map_err(|e| {
                format!(
                    "Error inserting entry `{}` into the database: {}",
                    root_name, e
                )
            })?;

        info!(
            "Root folder `{}` created successfully with ID {}.",
            root_name, inserted_root_id
        );

        let index_name = format!("idx_entries_by_root_and_parent_id_{}", inserted_root_id);
        let create_index_query = format!(
            "CREATE INDEX {} ON entries (parent_id) WHERE root_id = {};",
            index_name, inserted_root_id
        );

        diesel::sql_query(create_index_query)
            .execute(&mut connection)
            .map_err(|e| {
                format!(
                    "Failed to create index for root_id {}: {}",
                    inserted_root_id, e
                )
            })?;

        info!(
            "Index `{}` created successfully for root ID {}.",
            index_name, inserted_root_id
        );

        Ok(())
    }
}

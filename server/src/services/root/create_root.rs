use crate::{models::Entry, state::AppState};
use diesel::prelude::*;
use log::debug;

use super::RootService;

impl RootService {
    pub fn create_root(app_state: &AppState, root_name: &str) -> Result<Entry, String> {
        let mut connection = app_state.db_pool.get().map_err(|e| {
            format!(
                "Failed to get DB connection from pool while creating entry `{}`: {}",
                root_name, e
            )
        })?;

        let inserted_entry = Entry::create_root(&mut connection, root_name)?;

        Self::add_to_cache(&app_state, &inserted_entry)?;

        debug!(
            "Root folder `{}` created successfully with ID {}.",
            root_name, inserted_entry.id
        );

        let index_name = format!("idx_entries_by_root_id_{}", inserted_entry.id);
        let create_index_query = format!(
            "CREATE INDEX {} ON entries (parent_id) WHERE root_id = {};",
            index_name, inserted_entry.id
        );

        diesel::sql_query(create_index_query)
            .execute(&mut connection)
            .map_err(|e| {
                format!(
                    "Failed to create index for root_id {}: {}",
                    inserted_entry.id, e
                )
            })?;

        debug!(
            "Index `{}` created successfully for root ID {}.",
            index_name, inserted_entry.id
        );

        Ok(inserted_entry)
    }
}

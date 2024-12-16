use crate::{models::Entry, state::AppState};
use log::debug;

use super::RootService;

impl RootService {
    pub fn create_root(app_state: &AppState, root_name: &str) -> Result<Entry, String> {
        let mut conn = app_state.db_pool.get().map_err(|e| {
            format!(
                "Failed to get DB connection from pool while creating entry `{}`: {}",
                root_name, e
            )
        })?;

        let inserted_entry = Entry::create_root(&mut conn, root_name)?;

        Self::add_to_cache(&app_state, &inserted_entry)?;

        debug!(
            "Root folder `{}` created successfully with ID {}.",
            root_name, inserted_entry.id
        );

        let index_name = Entry::create_root_index(&mut conn, inserted_entry.id)?;

        debug!(
            "Index `{}` created successfully for root ID {}.",
            index_name, inserted_entry.id
        );

        Ok(inserted_entry)
    }
}

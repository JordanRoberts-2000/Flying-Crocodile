use crate::{models::Entry, schema::entries, state::AppState};
use diesel::prelude::*;

use super::RootService;

impl RootService {
    pub fn get_root(app_state: &AppState, folder_name: &str) -> Result<Entry, String> {
        let mut connection = app_state.db_pool.get().map_err(|e| {
            format!(
                "Failed to get DB connection from pool while retrieving root `{}`: {}",
                folder_name, e
            )
        })?;

        let result = entries::table
            .filter(entries::title.eq(folder_name))
            .filter(entries::parent_id.is_null())
            .first::<Entry>(&mut connection)
            .map_err(|e| {
                format!(
                    "Error querying root entry `{}` from database: {}",
                    folder_name, e
                )
            })?;

        Ok(result)
    }
}

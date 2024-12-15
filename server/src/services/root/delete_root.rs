use diesel::prelude::*;
use diesel::sql_query;
use log::debug;

use crate::models::Entry;
use crate::schema::entries;
use crate::state::AppState;

use super::RootService;

impl RootService {
    pub fn delete_root(app_state: &AppState, root_title: &str) -> Result<Entry, String> {
        let mut connection = app_state.db_pool.get().map_err(|e| {
            format!(
                "Failed to get DB connection from pool while deleting entry `{}`: {}",
                root_title, e
            )
        })?;

        let root_id = Self::get_root_id_from_cache(&app_state, root_title)?;

        // Drop the associated index
        let index_name = format!("idx_entries_by_root_id_{}", root_id);
        let drop_index_query = format!("DROP INDEX IF EXISTS {}; ", index_name);

        sql_query(drop_index_query)
            .execute(&mut connection)
            .map_err(|e| {
                format!(
                    "Failed to drop index `{}` for root ID {}: {}",
                    index_name, root_id, e
                )
            })?;

        debug!(
            "Index `{}` dropped successfully for root ID {}.",
            index_name, root_id
        );

        // Delete the root entry
        let deleted_entry: Entry = diesel::delete(entries::table.filter(entries::id.eq(root_id)))
            .returning(entries::all_columns)
            .get_result(&mut connection)
            .map_err(|e| {
                format!(
                    "Failed to delete root entry `{}` from the database: {}",
                    root_title, e
                )
            })?;

        Self::remove_from_cache(&app_state, root_title)?;

        debug!(
            "Root folder `{}` and its associated entries were deleted successfully.",
            root_title
        );

        Ok(deleted_entry)
    }
}

use diesel::prelude::*;
use diesel::sql_query;
use log::debug;

use crate::models::Entry;
use crate::schema::entries;
use crate::state::AppState;

use super::RootService;

impl RootService {
    pub fn delete_root(app_state: &AppState, root_title: &str) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let root_id = app_state.cache.root.get_root_id(root_title)?;

        // Drop the associated index
        let index_name = format!("idx_entries_by_root_id_{}", root_id);
        let drop_index_query = format!("DROP INDEX IF EXISTS {}; ", index_name);

        sql_query(drop_index_query)
            .execute(&mut conn)
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
            .get_result(&mut conn)
            .map_err(|e| {
                format!(
                    "Failed to delete root entry `{}` from the database: {}",
                    root_title, e
                )
            })?;

        app_state.cache.root.remove(root_title)?;

        debug!(
            "Root folder `{}` and its associated entries were deleted successfully.",
            root_title
        );

        Ok(deleted_entry)
    }
}

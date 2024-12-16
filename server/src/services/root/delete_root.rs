use crate::models::Entry;
use crate::state::AppState;

use super::RootService;

impl RootService {
    pub fn delete_root(app_state: &AppState, root_title: &str) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let root_id = app_state.cache.root.get_root_id(root_title)?;

        Entry::remove_root_index(&mut conn, root_id)?;

        let deleted_entry = Entry::delete_root(&mut conn, root_id)?;

        app_state.cache.root.remove(root_title)?;

        Ok(deleted_entry)
    }
}

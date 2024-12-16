use crate::models::{Entry, MinimalEntry};
use crate::state::AppState;

use super::EntryService;

impl EntryService {
    pub fn get_entries(
        app_state: &AppState,
        parent_id: Option<i32>,
        root_title: &str,
    ) -> Result<(i32, Vec<MinimalEntry>), String> {
        let mut conn = app_state.get_connection()?;

        let (folder_id, entries) = Entry::get_entries(&mut conn, parent_id, root_title)?;

        Ok((folder_id, entries))
    }
}

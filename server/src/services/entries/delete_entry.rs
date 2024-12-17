use crate::models::{DeleteEntryInput, Entry};
use crate::state::AppState;

use super::EntryService;

impl EntryService {
    pub fn delete_entry(app_state: &AppState, input: &DeleteEntryInput) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let is_root = input.entry_id.is_none();

        let entry_id = match input.entry_id {
            Some(id) => id,
            None => app_state
                .cache
                .root
                .get_root_id(input.root_title.as_str())?,
        };

        let deleted_entry = Entry::delete_entry(&mut conn, entry_id)?;

        if is_root {
            Entry::remove_root_index(&mut conn, entry_id)?;
            app_state.cache.root.remove(input.root_title.as_str())?;
        }

        Ok(deleted_entry)
    }
}

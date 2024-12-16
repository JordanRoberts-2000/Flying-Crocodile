use crate::models::{Entry, GetEntriesInput, MinimalEntry};
use crate::state::AppState;

use super::EntryService;

impl EntryService {
    pub fn get_entries(
        app_state: &AppState,
        input: &GetEntriesInput,
    ) -> Result<(i32, Vec<MinimalEntry>), String> {
        let mut conn = app_state.get_connection()?;

        let folder_id = match input.folder_id {
            Some(id) => id,
            None => app_state
                .cache
                .root
                .get_root_id(input.root_title.as_str())?,
        };

        let entries = Entry::get_entries(&mut conn, folder_id)?;

        Ok((folder_id, entries))
    }
}

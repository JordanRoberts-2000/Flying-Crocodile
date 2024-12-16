use crate::models::{Entry, GetEntriesInput, MinimalEntry};
use crate::state::AppState;

use super::EntryService;

impl EntryService {
    pub fn get_entries(
        app_state: &AppState,
        input: GetEntriesInput,
    ) -> Result<(i32, Vec<MinimalEntry>), String> {
        let mut conn = app_state.get_connection()?;

        // if input.folder_id is null, check input.root_title in root cache
        // let folder_id = app_state.cache.root.get_root_id(input.root_title.as_str());
        // folder_id = parent_id or cache result
        // Entry::get_entries(&mut conn, folder_id)?;

        let (folder_id, entries) =
            Entry::get_entries(&mut conn, input.folder_id, input.root_title.as_str())?;

        Ok((folder_id, entries))
    }
}

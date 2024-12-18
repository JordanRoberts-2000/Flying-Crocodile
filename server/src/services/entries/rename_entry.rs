use crate::{
    models::{Entry, RenameEntryInput},
    state::app_state::AppState,
};

use super::EntryService;

impl EntryService {
    pub fn rename_entry(app_state: &AppState, input: &RenameEntryInput) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let entry_id = match input.entry_id {
            Some(id) => id,
            None => app_state
                .cache
                .root
                .get_root_id(input.root_title.as_str())?,
        };

        let result = Entry::rename_entry(&mut conn, entry_id, input.new_title.as_str())?;

        Ok(result)
    }
}

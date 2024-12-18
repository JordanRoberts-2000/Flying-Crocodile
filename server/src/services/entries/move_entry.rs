use crate::models::{Entry, MoveEntryInput};
use crate::state::app_state::AppState;

use super::EntryService;

impl EntryService {
    pub fn move_entry(app_state: &AppState, input: &MoveEntryInput) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let moved_entry = Entry::move_entry(&mut conn, input.entry_id, input.new_parent_id)?;

        Ok(moved_entry)
    }
}

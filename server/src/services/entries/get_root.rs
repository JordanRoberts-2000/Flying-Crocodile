use crate::{models::Entry, state::app_state::AppState};

use super::EntryService;

impl EntryService {
    pub fn get_root(app_state: &AppState, title: &str) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let result = Entry::get_root(&mut conn, title)?;

        Ok(result)
    }
}

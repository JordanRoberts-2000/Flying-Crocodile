use crate::{models::Entry, state::AppState};

use super::RootService;

impl RootService {
    pub fn rename_root(
        app_state: &AppState,
        old_title: &str,
        new_title: &str,
    ) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let result = Entry::rename_root(&mut conn, old_title, new_title)?;

        Ok(result)
    }
}

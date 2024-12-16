use crate::{models::Entry, state::AppState};

use super::RootService;

impl RootService {
    pub fn create_root(app_state: &AppState, root_name: &str) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let inserted_entry = Entry::create_root(&mut conn, root_name)?;

        app_state.cache.root.add(&inserted_entry)?;

        Entry::create_root_index(&mut conn, inserted_entry.id)?;

        Ok(inserted_entry)
    }
}

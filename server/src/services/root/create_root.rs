use crate::{
    models::{Entry, NewEntry},
    state::AppState,
};

use super::RootService;

impl RootService {
    pub fn create_root(app_state: &AppState, root_name: &str) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let new_entry = NewEntry {
            title: root_name.to_string(),
            root_id: None,
            parent_id: None,
            is_folder: true,
        };

        let inserted_entry = Entry::create_entry(&mut conn, &new_entry)?;

        app_state.cache.root.add(&inserted_entry)?;

        Entry::create_root_index(&mut conn, inserted_entry.id)?;

        Ok(inserted_entry)
    }
}

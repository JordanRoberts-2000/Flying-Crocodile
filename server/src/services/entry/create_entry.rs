use crate::{
    models::{CreateEntryInput, Entry, NewEntry},
    state::AppState,
};

use super::EntryService;

impl EntryService {
    pub fn create_entry(app_state: &AppState, input: &CreateEntryInput) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let root_id = app_state
            .cache
            .root
            .get_root_id(input.root_title.as_str())?;

        let new_entry = NewEntry {
            title: input.title.clone(),
            root_id: Some(root_id),
            parent_id: Some(input.parent_id),
            is_folder: input.is_folder,
        };

        let inserted_entry = Entry::create_entry(&mut conn, &new_entry)?;

        Ok(inserted_entry)
    }
}

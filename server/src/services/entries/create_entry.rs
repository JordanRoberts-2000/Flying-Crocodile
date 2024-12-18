use crate::{
    models::{CreateEntryInput, Entry, NewEntry},
    state::app_state::AppState,
};

use super::EntryService;

impl EntryService {
    pub fn create_entry(app_state: &AppState, input: &CreateEntryInput) -> Result<Entry, String> {
        let mut conn = app_state.get_connection()?;

        let is_root = input.parent_id.is_none();

        let (root_id, parent_id, is_folder) = if is_root {
            if !input.is_folder {
                return Err("Root entries must be folders.".to_string());
            }
            (None, None, true)
        } else {
            let root_title = input
                .root_title
                .as_ref()
                .ok_or_else(|| "Root title must be provided for non-root entries.".to_string())?;

            let root_id = app_state.cache.root.get_root_id(root_title.as_str())?;
            (Some(root_id), input.parent_id, input.is_folder)
        };

        let new_entry = NewEntry {
            title: input.title.clone(),
            root_id,
            parent_id,
            is_folder,
        };

        let inserted_entry = Entry::create_entry(&mut conn, &new_entry)?;

        if is_root {
            app_state.cache.root.add(&inserted_entry)?;
            Entry::create_root_index(&mut conn, inserted_entry.id)?;
        }

        Ok(inserted_entry)
    }
}

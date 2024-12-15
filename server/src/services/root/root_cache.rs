use log::debug;

use crate::{models::Entry, state::AppState};

use super::RootService;

impl RootService {
    pub fn add_to_cache(app_state: &AppState, entry: &Entry) -> Result<(), String> {
        let mut cache = app_state
            .cache
            .root_cache
            .lock()
            .map_err(|e| format!("Failed to lock cache: {}", e))?;

        cache.insert(entry.title.clone(), entry.id);
        debug!("{} added to root cache", entry.title);

        Ok(())
    }

    pub fn remove_from_cache(app_state: &AppState, entry_title: &str) -> Result<i32, String> {
        let mut cache = app_state
            .cache
            .root_cache
            .lock()
            .map_err(|e| format!("Failed to lock cache: {}", e))?;

        if let Some(value) = cache.remove(entry_title) {
            debug!(
                "Entry `{}` removed from cache with value `{}`.",
                entry_title, value
            );
            Ok(value)
        } else {
            Err(format!("Entry `{}` not found in cache.", entry_title))
        }
    }

    pub fn get_roots_from_cache(app_state: &AppState) -> Result<Vec<String>, String> {
        let cache = app_state
            .cache
            .root_cache
            .lock()
            .map_err(|e| format!("Failed to lock cache: {}", e))?;

        Ok(cache.keys().cloned().collect())
    }

    pub fn get_root_id_from_cache(app_state: &AppState, entry_title: &str) -> Result<i32, String> {
        let cache = app_state
            .cache
            .root_cache
            .lock()
            .map_err(|e| format!("Failed to lock cache: {}", e))?;

        if let Some(&root_id) = cache.get(entry_title) {
            Ok(root_id)
        } else {
            Err(format!("Entry `{}` not found in cache.", entry_title))
        }
    }
}

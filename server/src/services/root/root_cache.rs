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

    pub fn all_roots_from_cache(app_state: &AppState) -> Result<Vec<String>, String> {
        let cache = app_state
            .cache
            .root_cache
            .lock()
            .map_err(|e| format!("Failed to lock cache: {}", e))?;

        Ok(cache.keys().cloned().collect())
    }
}

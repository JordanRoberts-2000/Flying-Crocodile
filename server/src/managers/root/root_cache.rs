use log::debug;

use crate::models::Entry;

use super::RootManager;

impl RootManager {
    pub fn add_to_cache(&self, entry: &Entry) -> Result<(), String> {
        let mut cache = self
            .cache
            .lock()
            .map_err(|e| format!("Failed to lock cache: {}", e))?;

        cache.insert(entry.title.clone(), entry.id);
        debug!("{} added to root cache", entry.title);

        Ok(())
    }
}

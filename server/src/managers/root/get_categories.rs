use super::RootManager;

impl RootManager {
    pub fn get_categories(&self) -> Result<Vec<String>, String> {
        let cache = self
            .cache
            .lock()
            .map_err(|e| format!("Failed to lock cache: {}", e))?;

        Ok(cache.keys().cloned().collect())
    }
}

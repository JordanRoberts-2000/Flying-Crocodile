use super::RootManager;

impl RootManager {
    pub fn get_categories(&self) -> Vec<String> {
        self.cache.keys().cloned().collect()
    }
}

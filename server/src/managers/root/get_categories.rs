use super::RootManager;

impl RootManager {
    pub fn get_categories(&self) -> Vec<String> {
        self.cache
            .values()
            .map(|entry| entry.title.clone())
            .collect()
    }
}

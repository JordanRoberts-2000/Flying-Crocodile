use log::info;

use crate::models::Entry;

use super::RootManager;

impl RootManager {
    pub fn add_to_cache(&mut self, entry: &Entry) {
        self.cache.insert(entry.title.clone(), entry.clone());
        info!("{} added to root cache", entry.title);
    }
}

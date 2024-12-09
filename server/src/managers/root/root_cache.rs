use log::debug;

use crate::models::Entry;

use super::RootManager;

impl RootManager {
    pub fn add_to_cache(&mut self, entry: &Entry) {
        self.cache.insert(entry.title.clone(), entry.id.clone());
        debug!("{} added to root cache", entry.title);
    }
}

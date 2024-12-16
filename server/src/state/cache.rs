use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use log::debug;

use crate::models::Entry;

pub struct AppCache {
    pub root: RootCache,
}

pub struct RootCache {
    pub cache: Arc<Mutex<HashMap<String, i32>>>,
}

impl RootCache {
    pub fn new() -> Self {
        Self {
            cache: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn add(&self, entry: &Entry) -> Result<(), String> {
        let mut cache = self
            .cache
            .lock()
            .map_err(|e| format!("Failed to lock root cache: {}", e))?;

        cache.insert(entry.title.clone(), entry.id);
        debug!("{} added to root cache", entry.title);

        Ok(())
    }

    pub fn remove(&self, entry_title: &str) -> Result<i32, String> {
        let mut cache = self
            .cache
            .lock()
            .map_err(|e| format!("Failed to lock root cache: {}", e))?;

        if let Some(value) = cache.remove(entry_title) {
            debug!(
                "Entry `{}` removed from root cache with value `{}`.",
                entry_title, value
            );
            Ok(value)
        } else {
            Err(format!("Entry `{}` not found in root cache.", entry_title))
        }
    }

    pub fn get_roots(&self) -> Result<Vec<String>, String> {
        let cache = self
            .cache
            .lock()
            .map_err(|e| format!("Failed to lock root cache: {}", e))?;

        Ok(cache.keys().cloned().collect())
    }

    pub fn get_root_id(&self, entry_title: &str) -> Result<i32, String> {
        let cache = self
            .cache
            .lock()
            .map_err(|e| format!("Failed to lock root cache: {}", e))?;

        if let Some(&root_id) = cache.get(entry_title) {
            Ok(root_id)
        } else {
            Err(format!("Entry `{}` not found in root cache.", entry_title))
        }
    }
}

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use crate::db::DbPool;

mod check_exists;
mod create_root;
mod delete;
mod get_categories;
mod get_root;
mod initialise;
mod rename;
mod root_cache;

pub struct RootManager {
    pub db_pool: DbPool,
    pub cache: Arc<Mutex<HashMap<String, i32>>>,
}

impl RootManager {
    pub fn new(db_pool: &DbPool) -> Self {
        Self {
            db_pool: db_pool.clone(),
            cache: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

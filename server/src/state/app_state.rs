use diesel::{
    r2d2::{ConnectionManager, PooledConnection},
    PgConnection,
};
use log::error;
use std::sync::Arc;

use crate::db::{get_connection_pool, DbPool};

use super::{
    cache::{AppCache, RootCache},
    config::AppConfig,
    session_store::SessionStore,
};

pub struct AppState {
    pub db_pool: DbPool,
    pub config: AppConfig,
    pub cache: AppCache,
    pub session_store: SessionStore,
}

impl AppState {
    pub fn initialize() -> Arc<AppState> {
        let db_pool = match get_connection_pool() {
            Ok(pool) => pool,
            Err(err) => {
                error!("Failed to initialize database connection pool: {}", err);
                std::process::exit(1);
            }
        };

        Arc::new(AppState {
            db_pool,
            config: AppConfig::new(),
            cache: AppCache {
                root: RootCache::new(),
            },
            session_store: SessionStore::new(),
        })
    }

    pub fn get_connection(
        &self,
    ) -> Result<PooledConnection<ConnectionManager<PgConnection>>, String> {
        self.db_pool
            .get()
            .map_err(|e| format!("Failed to get DB connection from pool: {}", e))
    }
}

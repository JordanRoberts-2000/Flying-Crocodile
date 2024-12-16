pub mod cache;

use std::{env, sync::Arc, time::Instant};

use cache::{AppCache, RootCache};
use diesel::{
    r2d2::{ConnectionManager, PooledConnection},
    PgConnection,
};
use log::{error, warn};

use crate::db::{get_connection_pool, DbPool};

pub struct AppConfig {
    pub start_time: Instant,
    pub environment: String,
}

pub struct AppState {
    pub db_pool: DbPool,
    pub cache: AppCache,
    pub config: AppConfig,
}
impl AppState {
    pub fn initialize() -> Arc<AppState> {
        let environment = match env::var("ENVIRONMENT") {
            Ok(value) => value,
            Err(_) => {
                warn!("ENVIRONMENT not set in .env, defaulting to 'production'");
                "production".to_string()
            }
        };

        let db_pool = match get_connection_pool() {
            Ok(pool) => pool,
            Err(err) => {
                error!("Failed to initialize database connection pool: {}", err);
                std::process::exit(1);
            }
        };

        Arc::new(AppState {
            db_pool,
            cache: AppCache {
                root: RootCache::new(),
            },
            config: AppConfig {
                start_time: Instant::now(),
                environment,
            },
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

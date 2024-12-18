use log::warn;
use std::{env, time::Instant};

pub struct AppConfig {
    pub start_time: Instant,
    pub environment: String,
}

impl AppConfig {
    pub fn new() -> Self {
        let environment = match env::var("ENVIRONMENT") {
            Ok(value) => value,
            Err(_) => {
                warn!("ENVIRONMENT not set in .env, defaulting to 'production'");
                "production".to_string()
            }
        };
        Self {
            start_time: Instant::now(),
            environment,
        }
    }
}

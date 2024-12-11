use actix_governor::{
    governor::middleware::NoOpMiddleware, Governor, GovernorConfigBuilder, PeerIpKeyExtractor,
};
use log::warn;
use std::env;
use std::sync::Arc;

pub fn setup_limiter() -> Arc<Governor<PeerIpKeyExtractor, NoOpMiddleware>> {
    // Fetch the rate limit from the environment or use a default value
    let limit = match env::var("RATE_LIMIT") {
        Ok(value) => value.parse::<u32>().unwrap_or_else(|_| {
            warn!("RATE_LIMIT env variable was invalid, defaulting to '1000'");
            1000
        }),
        Err(_) => {
            warn!("RATE_LIMIT not set in .env, defaulting to '1000'");
            1000
        }
    };

    // Configure the Governor rate limiter
    Arc::new(Governor::new(
        &GovernorConfigBuilder::default()
            .seconds_per_request((limit / (60 * 60 * 24)).into()) // Convert daily limit to per-second limit
            .burst_size(limit) // Allow bursts up to the daily limit
            .finish()
            .expect("Failed to configure rate limiter"),
    ))
}

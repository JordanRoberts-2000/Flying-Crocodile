use actix_governor::{
    governor::{
        clock::{Clock, DefaultClock},
        middleware::NoOpMiddleware,
    },
    Governor, GovernorConfigBuilder, KeyExtractor,
};
use actix_web::{dev::ServiceRequest, http::header::ContentType};
use log::{error, warn};
use std::{convert::Infallible, env, sync::Arc, time::Duration};

// Global rate limiting, instead of per ip
#[derive(Clone, Debug)]
pub struct GlobalKeyExtractor;

impl KeyExtractor for GlobalKeyExtractor {
    type Key = String;
    type KeyExtractionError = Infallible;

    fn extract(&self, _req: &ServiceRequest) -> Result<Self::Key, Self::KeyExtractionError> {
        Ok("global_key".to_string())
    }

    fn exceed_rate_limit_response(
        &self,
        negative: &actix_governor::governor::NotUntil<
            actix_governor::governor::clock::QuantaInstant,
        >,
        mut response: actix_web::HttpResponseBuilder,
    ) -> actix_web::HttpResponse {
        let wait_time = negative
            .wait_time_from(DefaultClock::default().now())
            .as_secs();
        error!("Rate limit exceeded");

        response
            .status(actix_web::http::StatusCode::TOO_MANY_REQUESTS)
            .content_type(ContentType::plaintext())
            .body(format!("Too many requests, retry in {}s", wait_time))
    }
}

pub fn setup_limiter() -> Arc<Governor<GlobalKeyExtractor, NoOpMiddleware>> {
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

    Arc::new(Governor::new(
        &GovernorConfigBuilder::default()
            .const_period(Duration::from_secs(86_400)) // 1 day = 86,400 seconds
            .burst_size(limit)
            .key_extractor(GlobalKeyExtractor)
            .finish()
            .expect("Failed to configure rate limiter"),
    ))
}

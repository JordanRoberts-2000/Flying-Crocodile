use log::error;

pub fn get_env_var(key: &str) -> Result<String, actix_web::Error> {
    std::env::var(key).map_err(|e| {
        error!("Failed to load env variable `{}`: {}", key, e);
        actix_web::error::ErrorInternalServerError("Internal server error")
    })
}

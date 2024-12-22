use actix_web::{middleware::Logger, HttpRequest};
use log::{debug, error, info, warn};

pub fn initialize_logger() {
    env_logger::builder()
        .format_module_path(false)
        .format_target(false)
        .format_timestamp(None)
        .init();
}

pub fn logging_middleware() -> Logger {
    Logger::new("%U %{METHOD}xi - status: %s, bytes: %b, completed in: %Ts")
        .custom_request_replace("METHOD", |req| req.method().to_string())
}

pub struct Log;

impl Log {
    pub fn debug(req: &HttpRequest, message: &str) {
        let method = req.method();
        let path = req.path();
        debug!("{} {} - {}", method, path, message);
    }

    pub fn info(req: &HttpRequest, message: &str) {
        let method = req.method();
        let path = req.path();
        info!("{} {} - {}", method, path, message);
    }

    pub fn warn(req: &HttpRequest, message: &str) {
        let method = req.method();
        let path = req.path();
        warn!("{} {} - {}", method, path, message);
    }

    pub fn error(req: &HttpRequest, message: &str) {
        let method = req.method();
        let path = req.path();
        error!("{} {} - {}", method, path, message);
    }
}

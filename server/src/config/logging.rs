use actix_web::{middleware::Logger, HttpRequest};
use log::{debug, error, info, warn, Level};

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
    pub fn log(req: &HttpRequest, level: Level, message: &str) {
        let method = req.method();
        let path = req.path();
        let formatted_message = format!("{} {} - {}", method, path, message);

        match level {
            Level::Debug => debug!("{}", formatted_message),
            Level::Info => info!("{}", formatted_message),
            Level::Warn => warn!("{}", formatted_message),
            Level::Error => error!("{}", formatted_message),
            _ => (),
        }
    }

    pub fn debug(req: &HttpRequest, message: &str) {
        Self::log(req, Level::Debug, message);
    }

    pub fn info(req: &HttpRequest, message: &str) {
        Self::log(req, Level::Info, message);
    }

    pub fn warn(req: &HttpRequest, message: &str) {
        Self::log(req, Level::Warn, message);
    }

    pub fn error(req: &HttpRequest, message: &str) {
        Self::log(req, Level::Error, message);
    }
}

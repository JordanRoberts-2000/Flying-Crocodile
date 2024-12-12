pub mod db;
pub mod graphql;
pub mod managers;
mod models;
mod routes;
mod schema;
pub mod utils;

use actix_cors::Cors;
use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use db::{get_connection_pool, DbPool};
use graphql::schema::create_schema;
use graphql::{graphql_handler, index_graphiql};
use log::{debug, error, warn};
use managers::{folder::FolderManager, root::RootManager};
use routes::health::health_check;
use std::env;
use std::sync::{Arc, Mutex};
use std::time::Instant;
use utils::setup_limiter::setup_limiter;

pub struct AppConfig {
    pub start_time: Instant,
    pub environment: String,
}
pub struct AppState {
    pub db_pool: DbPool,
    pub root_manager: RootManager,
    pub folder_manager: FolderManager,
    pub config: AppConfig,
}

pub fn initialize_app() -> Arc<Mutex<AppState>> {
    env_logger::builder()
        .format_module_path(false)
        .format_target(false)
        .format_timestamp(None)
        .init();

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

    let folder_manager = FolderManager::new(&db_pool);
    let mut root_manager = RootManager::new(&db_pool);

    if let Err(err) = root_manager.initialize() {
        error!("Failed to initialize root folders: {}", err);
        std::process::exit(1);
    }

    Arc::new(Mutex::new(AppState {
        db_pool,
        root_manager,
        folder_manager,
        config: AppConfig {
            start_time: Instant::now(),
            environment,
        },
    }))
}

pub fn create_server(app_state: Arc<Mutex<AppState>>) -> Server {
    let port: u16 = match env::var("PORT") {
        Ok(value) => match value.parse::<u16>() {
            Ok(parsed_port) => parsed_port,
            Err(_) => {
                warn!("Invalid PORT value in .env, defaulting to '3000'");
                3000
            }
        },
        Err(_) => {
            warn!("PORT not set in .env, defaulting to '3000'");
            3000
        }
    };
    debug!("Port used: {port}");

    let schema = create_schema(app_state.clone());

    let rate_limiter = setup_limiter();

    let environment;
    {
        let app_state = app_state.lock().unwrap();
        environment = app_state.config.environment.clone();
    }

    HttpServer::new(move || {
        let cors_config = if environment == "development" {
            Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
        } else {
            Cors::default()
        };

        App::new()
            .wrap(rate_limiter.clone())
            .wrap(cors_config)
            .app_data(web::Data::new(schema.clone()))
            .app_data(web::Data::new(app_state.clone()))
            .route("/graphql", web::get().to(index_graphiql))
            .route("/graphql", web::post().to(graphql_handler))
            .route("/health", web::get().to(health_check))
    })
    .bind(("0.0.0.0", port))
    .unwrap_or_else(|err| {
        error!("Failed to bind server to address: {}", err);
        std::process::exit(1);
    })
    .run()
}

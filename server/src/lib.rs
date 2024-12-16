pub mod config;
pub mod db;
pub mod graphql;
pub mod models;
mod routes;
pub mod schema;
pub mod services;
pub mod state;
pub mod utils;

use actix_cors::Cors;
use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use config::logging::initialize_logger;
use graphql::create_schema::create_schema;
use graphql::{graphql_handler, index_graphiql};
use log::{error, warn};
use routes::health::health_check;
use services::root::RootService;
use state::AppState;
use std::env;
use std::sync::Arc;
use utils::setup_limiter::setup_limiter;

pub fn create_server(app_state: Arc<AppState>) -> (u16, Server) {
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

    initialize_logger();

    let schema = create_schema(&app_state);

    let rate_limiter = setup_limiter();

    let environment = app_state.config.environment.clone();

    RootService::create_initial_roots(&app_state);

    (
        port,
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
        .run(),
    )
}

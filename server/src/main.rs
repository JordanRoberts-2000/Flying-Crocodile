use actix_cors::Cors;
use actix_web::{guard, web, App, HttpServer};
use db::{get_connection_pool, DbPool};
use dotenv::dotenv;
use graphql::{graphql_handler, index_graphiql, schema::create_schema};
use log::{error, info, warn};
use routes::health::health_check;
use std::{env, time::Instant};
use utils::ensure_root_folders::ensure_root_folders;

mod db;
mod graphql;
mod models;
mod routes;
mod schema;
mod utils;

pub struct AppState {
    pub db_pool: DbPool,
    pub start_time: Instant,
    pub environment: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let environment = match env::var("ENVIRONMENT") {
        Ok(value) => value,
        Err(_) => {
            warn!("ENVIRONMENT not set in .env, defaulting to 'production'");
            "production".to_string()
        }
    };
    info!("Starting application in {} environment", environment);

    let port = match env::var("PORT") {
        Ok(value) => value,
        Err(_) => {
            warn!("PORT not set in .env, defaulting to '3000'");
            "3000".to_string()
        }
    };

    let start_time = Instant::now();

    let db_pool = match get_connection_pool() {
        Ok(pool) => {
            info!("Application successfully connected to the database");
            pool
        }
        Err(err) => {
            error!("Failed to initialize database connection pool: {}", err);
            std::process::exit(1);
        }
    };

    match ensure_root_folders(&db_pool) {
        Ok(_) => info!("Root folders setup."),
        Err(err) => {
            error!("Failed to setup root folders: {}", err);
            std::process::exit(1);
        }
    }

    let schema = create_schema(&db_pool);
    info!("GraphQL schema is ready to use");

    let app_state = web::Data::new(AppState {
        db_pool,
        start_time,
        environment,
    });

    let server = HttpServer::new(move || {
        let cors = if app_state.environment == "development" {
            info!("CORS: Allowing any origin (development mode)");
            Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
        } else {
            info!("CORS: Default configuration (production mode)");
            Cors::default()
        };
        App::new()
            .wrap(cors)
            .app_data(web::Data::new(schema.clone()))
            .app_data(app_state.clone())
            .service(
                web::resource("/graphql")
                    .guard(guard::Post())
                    .to(graphql_handler),
            )
            .service(
                web::resource("/graphql")
                    .guard(guard::Get())
                    .to(index_graphiql),
            )
            .route("/health", web::get().to(health_check))
    })
    .bind(("0.0.0.0", port.parse::<u16>().expect("Invalid PORT")))?;

    info!("Server is running on port: {}", port);

    server.run().await
}

// host react files
// clippy vs rust analyser
// nodemon for rust
// how will logs work in railway???
// better error handling, also .expect vs !fatal()
// add logs to all routes
// commit changes

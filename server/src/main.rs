use actix_cors::Cors;
use actix_web::{guard, web, App, HttpServer};
use db::{get_connection_pool, DbPool};
use dotenv::dotenv;
use graphql::{graphql_handler, index_graphiql, schema::create_schema};
use log::{error, info, warn};
use managers::root::RootManager;
use routes::health::health_check;
use std::{env, sync::Arc, time::Instant};

mod db;
mod graphql;
mod managers;
mod models;
mod routes;
mod schema;
pub struct AppState {
    pub db_pool: DbPool,
    pub start_time: Instant,
    pub environment: String,
    pub root_manager: RootManager,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    env_logger::builder().format_timestamp(None).init();

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

    let mut root_manager = RootManager::new(&db_pool);
    match root_manager.initialize() {
        Ok(_) => {
            info!("Root folders initialized successfully.");
        }
        Err(err) => {
            error!("Failed to initialize root folders: {}", err);
            std::process::exit(1);
        }
    };

    if environment == "development" {
        info!("CORS: Allowing any origin (development mode)");
    } else {
        info!("CORS: Default configuration (production mode)");
    }

    let app_state = Arc::new(AppState {
        db_pool,
        start_time: Instant::now(),
        environment,
        root_manager,
    });

    let schema = create_schema(app_state.clone());
    info!("GraphQL schema is ready to use");

    let server = HttpServer::new(move || {
        let cors = if app_state.environment.clone() == "development" {
            Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
        } else {
            Cors::default()
        };

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(schema.clone()))
            .app_data(web::Data::new(app_state.clone()))
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

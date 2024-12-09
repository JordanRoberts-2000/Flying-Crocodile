use actix_cors::Cors;
use actix_web::{guard, web, App, HttpServer};
use db::{get_connection_pool, DbPool};
use dotenv::dotenv;
use graphql::{graphql_handler, index_graphiql, schema::create_schema};
use log::{error, info, warn};
use managers::{folder::FolderManager, root::RootManager};
use routes::health::health_check;
use std::{
    env,
    sync::{Arc, Mutex},
    time::Instant,
};

mod db;
mod graphql;
mod managers;
mod models;
mod routes;
mod schema;

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

    let folder_manager = FolderManager::new(&db_pool);

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

    let app_state = Arc::new(Mutex::new(AppState {
        db_pool,
        root_manager,
        folder_manager,
        config: AppConfig {
            start_time: Instant::now(),
            environment,
        },
    }));

    let schema = create_schema(app_state.clone());
    info!("GraphQL schema is ready to use");

    let server = HttpServer::new(move || {
        let cors_config;
        {
            let app_state = app_state.lock().unwrap();
            cors_config = if app_state.config.environment == "development" {
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            } else {
                Cors::default()
            };
        }

        App::new()
            .wrap(cors_config)
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

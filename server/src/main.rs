use actix_cors::Cors;
use actix_web::{guard, web, App, HttpServer};
use db::get_connection_pool;
use dotenv::dotenv;
use graphql::{graphql_handler, index_graphiql, schema::create_schema};
use routes::health::health_check;
use std::{env, time::Instant};
use utils::initialize_root_folders;

mod db;
mod graphql;
mod models;
mod routes;
mod schema;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let environment = env::var("ENVIRONMENT").expect("ENVIRONMENT not found in .env");
    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    println!("Current environment: {}", environment);

    let start_time = Instant::now();
    let db_pool = get_connection_pool();
    initialize_root_folders(&db_pool.clone());
    let schema = web::Data::new(create_schema(&db_pool.clone()));
    println!("Server running on port: {port}");

    HttpServer::new(move || {
        let cors = if environment == "development" {
            Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
        } else {
            Cors::default()
        };
        App::new()
            .wrap(cors)
            .app_data(schema.clone())
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(start_time))
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
    .bind(("127.0.0.1", port.parse::<u16>().expect("Invalid PORT")))?
    .run()
    .await
}

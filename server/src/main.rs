use std::time::Instant;

use actix_cors::Cors;
use actix_web::{guard, web, App, HttpResponse, HttpServer, Result};
use async_graphql::http::GraphiQLSource;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use db::get_connection_pool;
use graphql::schema::{create_schema, AppSchema};
use routes::health::health_check;
use utils::initialize_root_folders;

mod db;
mod graphql;
mod models;
mod routes;
mod schema;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let start_time = Instant::now();
    let db_pool = get_connection_pool();
    initialize_root_folders(&db_pool.clone());
    let schema = web::Data::new(create_schema(&db_pool.clone()));
    println!("Server running");
    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin() // Allows all origins
                    .allow_any_method() // Allows any HTTP method (GET, POST, etc.)
                    .allow_any_header(),
            )
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
    .bind(("127.0.0.1", 3000))?
    .run()
    .await
}

async fn graphql_handler(schema: web::Data<AppSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

async fn index_graphiql() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(GraphiQLSource::build().endpoint("/graphql").finish()))
}

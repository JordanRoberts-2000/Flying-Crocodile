use actix_cors::Cors;
use actix_web::{guard, web, App, HttpResponse, HttpServer, Result};
use async_graphql::http::GraphiQLSource;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use db::get_connection_pool;
use graphql::schema::{create_schema, AppSchema};
use utils::initialize_root_folders;

mod db;
mod graphql;
mod models;
mod schema;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = get_connection_pool();
    initialize_root_folders(&db.clone());
    let schema = web::Data::new(create_schema(db));
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

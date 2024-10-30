use actix_web::{web, App, HttpServer};
use db::get_connection_pool;

mod db;
mod handlers;
mod models;
mod routes;
mod schema;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_pool = get_connection_pool();
    println!("Server running");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db_pool.clone()))
            .configure(routes::init_routes)
    })
    .bind(("127.0.0.1", 3000))?
    .run()
    .await
}

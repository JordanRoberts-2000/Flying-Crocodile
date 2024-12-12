use dotenv::dotenv;
use log::info;
use my_project::create_server;
use my_project::initialize_app;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let app_state = initialize_app();
    let server = create_server(app_state);
    info!("Server is running");

    server.await
}

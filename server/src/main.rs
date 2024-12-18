use dotenv::dotenv;
use log::info;
use my_project::create_server;
use my_project::state::app_state::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let app_state = AppState::initialize();
    let (port, server) = create_server(app_state);

    info!("Server is running on port: {}", port);

    server.await
}

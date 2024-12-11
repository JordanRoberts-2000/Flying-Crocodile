use dotenv::dotenv;
use log::info;
use my_project::create_server;
use my_project::initialize_app;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let app_state = initialize_app();
    let server = create_server(app_state);
    info!("Server is running at http://0.0.0.0:3000");

    server.await
}

// let port = match env::var("PORT") {
//     Ok(value) => value,
//     Err(_) => {
//         warn!("PORT not set in .env, defaulting to '3000'");
//         "3000".to_string()
//     }
// };

//     .bind(("0.0.0.0", port.parse::<u16>().expect("Invalid PORT")))?;

//     info!("Server is running on port: {}", port);

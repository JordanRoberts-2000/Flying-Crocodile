use actix_web::{http::StatusCode, test, web, App};
use my_project::{handlers::health_check::health_check, state::app_state::AppState};

#[actix_web::test]
async fn test_health_check() {
    dotenv::from_filename(".env.test").ok();

    let app_state = AppState::initialize();

    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .route("/health", web::get().to(health_check)),
    )
    .await;

    let req = test::TestRequest::get().uri("/health").to_request();
    let res = test::call_service(&app, req).await;

    assert_eq!(
        res.status(),
        StatusCode::OK,
        "Health check should return HTTP 200"
    );

    let body = test::read_body(res).await;
    let json: serde_json::Value =
        serde_json::from_slice(&body).expect("Response should be valid JSON");

    assert_eq!(json["status"], "ok", "Expected status to be 'ok'");
    assert_eq!(
        json["environment"], "test",
        "Expected environment to be 'test'"
    );
    assert!(
        json["database"] == "connected" || json["database"] == "disconnected",
        "Database status should be 'connected' or 'disconnected'"
    );
    assert!(json["uptime"].is_number(), "Uptime should be a number");
}

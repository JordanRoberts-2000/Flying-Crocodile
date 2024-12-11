use std::env;

use actix_web::{http::StatusCode, test, web, App, HttpResponse, Responder};
use my_project::utils::setup_limiter::setup_limiter;

async fn test_handler() -> impl Responder {
    HttpResponse::Ok().body("Request succeeded")
}

#[actix_web::test]
async fn test_rate_limiter() {
    dotenv::from_filename(".env.test").ok();

    let limit = env::var("RATE_LIMIT")
        .expect("Failed to retrieve RATE_LIMIT")
        .parse::<u32>()
        .expect("Failed to parse RATE_LIMIT");

    let rate_limiter = setup_limiter();

    let app = test::init_service(
        App::new()
            .wrap(rate_limiter)
            .route("/", web::get().to(test_handler)),
    )
    .await;

    for _ in 0..limit {
        let req = test::TestRequest::get().uri("/").to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::OK, "Request within limit failed");
    }

    let req = test::TestRequest::get().uri("/").to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(
        resp.status(),
        actix_web::http::StatusCode::TOO_MANY_REQUESTS
    );

    // tokio::time::sleep(std::time::Duration::from_secs(1)).await;

    // // Send another request (should succeed after reset)
    // let req = test::TestRequest::get().uri("/").to_request();
    // let resp = test::call_service(&app, req).await;
    // assert_eq!(resp.status(), actix_web::http::StatusCode::OK);
}

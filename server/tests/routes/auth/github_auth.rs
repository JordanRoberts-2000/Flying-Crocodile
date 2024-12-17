use actix_web::{test, web, App};
use my_project::handlers::auth::github_auth::github_auth;
use std::env;

#[actix_web::test]
async fn test_github_auth() {
    dotenv::from_filename(".env.test").ok();
    let client_id = env::var("GITHUB_CLIENT_ID").expect("Failed to retrieve GITHUB_CLIENT_ID");
    let redirect_uri =
        env::var("GITHUB_REDIRECT_URI").expect("Failed to retrieve GITHUB_REDIRECT_URI");

    let app =
        test::init_service(App::new().route("/auth/github", web::get().to(github_auth))).await;

    let req = test::TestRequest::get().uri("/auth/github").to_request();
    let resp = test::call_service(&app, req).await;

    // Check the status code is 302 Found
    assert_eq!(
        resp.status(),
        actix_web::http::StatusCode::FOUND,
        "Expected 302 Found status code"
    );

    // Check the Location header contains the correct URL and parameters
    let headers = resp.headers();
    let location_header = headers.get("Location").expect("Location header missing");
    let location_str = location_header.to_str().expect("Invalid Location header");

    // Assert that the URL starts correctly
    assert!(
        location_str.starts_with("https://github.com/login/oauth/authorize"),
        "Redirect URL does not start with the correct base"
    );

    // Check that client_id and redirect_uri match environment variables
    assert!(
        location_str.contains(&format!("client_id={}", client_id)),
        "client_id parameter is incorrect"
    );

    let expected_redirect_uri = format!(
        "redirect_uri={}",
        url::form_urlencoded::byte_serialize(redirect_uri.as_bytes()).collect::<String>()
    );

    assert!(
        location_str.contains(&expected_redirect_uri),
        "Expected redirect_uri parameter to be '{}', but the actual URI was '{}'",
        expected_redirect_uri,
        location_str
    );

    // Check scope and state parameters
    let expected_scope = format!(
        "scope={}",
        url::form_urlencoded::byte_serialize("user:email read:user".as_bytes()).collect::<String>()
    );

    assert!(
        location_str.contains(&expected_scope),
        "Expected scope parameter to be '{}', but the actual URI was '{}'",
        expected_scope,
        location_str
    );

    assert!(
        location_str.contains("state="),
        "state parameter is missing; CSRF protection should include state"
    );
}

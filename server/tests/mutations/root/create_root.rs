use actix_web::{test, web, App};
use my_project::{
    graphql::{graphql_handler, schema::create_schema},
    initialize_app,
};
use serde_json::json;

#[actix_web::test]
async fn test_create_root_mutation() {
    dotenv::from_filename(".env.test").ok();

    let app_state = initialize_app();

    let schema = create_schema(app_state.clone());

    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(schema.clone()))
            .route("/graphql", web::post().to(graphql_handler)),
    )
    .await;

    let mutation = json!({
        "query": "mutation CreateRoot($title: String!) {
          createRoot(newRootTitle: $title) {
              id
              title
              parentId
              rootId
              isFolder
          }
      }",
        "variables": {
            "title": "New Category"
        }
    });

    let req = test::TestRequest::post()
        .uri("/graphql")
        .set_json(&mutation)
        .to_request();

    let resp = test::call_service(&app, req).await;

    assert!(
        resp.status().is_success(),
        "Response status was not successful"
    );

    let body: serde_json::Value = test::read_body_json(resp).await;

    assert!(
        body.get("errors").is_none(),
        "Expected no errors, but found: {:?}",
        body.get("errors")
    );
}

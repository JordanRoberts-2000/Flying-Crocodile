use async_graphql::{Request, Variables};
use my_project::{graphql::create_schema::create_schema, state::AppState};
use serde_json::json;

use crate::helper_functions::db_reset;

#[tokio::test]
async fn test_create_root_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let schema = create_schema(&app_state);

            let mutation_query = "mutation CreateRoot($title: String!) {
                createRoot(newRootTitle: $title) {
                    id
                    title
                    parentId
                    rootId
                    isFolder
                }
            }";

            // Helper function to create a request with variables
            let create_request = |title: &str| {
                Request::new(mutation_query).variables(Variables::from_json(json!({
                    "title": title
                })))
            };

            // First Mutation
            let first_response = schema.execute(create_request("new title")).await;

            assert!(
                first_response.errors.is_empty(),
                "Expected no errors, but found: {:?}",
                first_response.errors
            );

            let data = first_response
                .data
                .into_json()
                .expect("Failed to parse response data");
            let created_entry = data.get("createRoot").expect("Missing createRoot field");

            assert_eq!(
                created_entry["title"], "new title",
                "The created entry title does not match"
            );

            // Check unique constraint on database
            let second_response = schema.execute(create_request("different title")).await;

            assert!(
                second_response.errors.is_empty(),
                "Expected no errors, but found: {:?}",
                second_response.errors
            );

            let third_response = schema.execute(create_request("new title")).await;

            assert!(
                !third_response.errors.is_empty(),
                "Expected an error due to duplicate root title, but found none"
            );
        })
    })
    .await;
}

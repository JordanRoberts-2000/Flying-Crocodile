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

            let mutation = Request::new(
                "mutation CreateRoot($title: String!) {
                    createRoot(newRootTitle: $title) {
                        id
                        title
                        parentId
                        rootId
                        isFolder
                    }
                }",
            )
            .variables(Variables::from_json(json!({
                "title": "new category"
            })));

            let response = schema.execute(mutation).await;

            assert!(
                response.errors.is_empty(),
                "Expected no errors, but found: {:?}",
                response.errors
            );

            let data = response
                .data
                .into_json()
                .expect("Failed to parse response data");
            let created_entry = data.get("createRoot").expect("Missing createRoot field");

            assert_eq!(
                created_entry["title"], "new category",
                "The created entry title does not match"
            );
        })
    })
    .await;
}

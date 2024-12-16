use async_graphql::{Request, Variables};
use my_project::{graphql::create_schema::create_schema, state::AppState};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    entries::{check_entry_in_db::check_entry_in_db, check_index_in_db::check_index_in_db},
    load_graphql::{load_graphql, Mutation},
};

#[tokio::test]
async fn test_create_root_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let mut connection = app_state
                .db_pool
                .get()
                .expect("Failed to get database connection");
            let schema = create_schema(&app_state);

            let mutation_query = load_graphql(Mutation::CreateRoot);

            let create_request = |title: &str| {
                Request::new(&mutation_query).variables(Variables::from_json(json!({
                    "title": title
                })))
            };

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

            let created_id = created_entry["id"]
                .as_i64()
                .expect("Created entry ID should be an integer")
                as i32;

            check_entry_in_db(&mut connection, created_id)
                .expect("Failed to find entry in the database");

            let index_name = format!("idx_entries_by_root_id_{}", created_id);
            check_index_in_db(&mut connection, &index_name)
                .expect("Failed to find index in the database");

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

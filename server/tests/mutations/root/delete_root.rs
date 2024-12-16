use async_graphql::{Request, Variables};
use my_project::{graphql::create_schema::create_schema, state::AppState};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    entries::{check_entry_in_db::check_entry_in_db, check_index_in_db::check_index_in_db},
    load_graphql::{load_graphql, Mutation},
};

#[tokio::test]
async fn test_delete_root_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let mut connection = app_state
                .db_pool
                .get()
                .expect("Failed to get DB connection");
            let schema = create_schema(&app_state);

            let create_mutation_query = load_graphql(Mutation::CreateRoot);

            let delete_mutation_query = load_graphql(Mutation::DeleteRoot);

            let create_request = |title: &str| {
                Request::new(create_mutation_query).variables(Variables::from_json(json!({
                    "title": title
                })))
            };

            let delete_request = |title: &str| {
                Request::new(delete_mutation_query).variables(Variables::from_json(json!({
                    "title": title
                })))
            };

            let create_response = schema.execute(create_request("new title")).await;

            assert!(
                create_response.errors.is_empty(),
                "Expected no errors during creation, but found: {:?}",
                create_response.errors
            );

            let create_data = create_response
                .data
                .into_json()
                .expect("Failed to parse create response data");
            let created_entry = create_data
                .get("createRoot")
                .expect("Missing createRoot field");

            assert_eq!(
                created_entry["title"], "new title",
                "The created entry title does not match"
            );

            let created_id = created_entry["id"]
                .as_i64()
                .expect("Created entry ID should be an integer")
                as i32;

            let delete_response = schema.execute(delete_request("new title")).await;

            assert!(
                delete_response.errors.is_empty(),
                "Expected no errors during deletion, but found: {:?}",
                delete_response.errors
            );

            let delete_data = delete_response
                .data
                .into_json()
                .expect("Failed to parse delete response data");
            let deleted_entry = delete_data
                .get("deleteRoot")
                .expect("Missing deleteRoot field");

            assert_eq!(
                deleted_entry["id"], created_entry["id"],
                "The deleted entry ID does not match the created entry ID"
            );
            assert_eq!(
                deleted_entry["title"], created_entry["title"],
                "The deleted entry title does not match the created entry title"
            );

            let entry_check_result = check_entry_in_db(&mut connection, created_id);

            assert!(
                entry_check_result.is_err(),
                "Expected the entry to be deleted, but it still exists in the database"
            );

            let index_name = format!("idx_entries_by_root_id_{}", created_id);
            let index_check_result = check_index_in_db(&mut connection, &index_name);

            assert!(
                index_check_result.is_err(),
                "Expected the index `{}` to be deleted, but it still exists in the database",
                index_name
            );
        })
    })
    .await;
}

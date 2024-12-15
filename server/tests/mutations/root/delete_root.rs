use async_graphql::{Request, Variables};
use my_project::{
    graphql::{create_schema::create_schema, queries::entries},
    state::AppState,
};
use serde_json::json;

use crate::helper_functions::db_reset;

#[tokio::test]
async fn test_delete_root_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            // Initialize app state and schema
            let app_state = AppState::initialize();
            let schema = create_schema(&app_state);

            // Mutation queries
            let create_mutation_query = "mutation CreateRoot($title: String!) {
                createRoot(newRootTitle: $title) {
                    id
                    title
                    parentId
                    rootId
                    isFolder
                }
            }";

            let delete_mutation_query = "mutation DeleteRoot($title: String!) {
                deleteRoot(rootTitle: $title) {
                    id
                    title
                    parentId
                    rootId
                    isFolder
                }
            }";

            // Helper to construct create request
            let create_request = |title: &str| {
                Request::new(create_mutation_query).variables(Variables::from_json(json!({
                    "title": title
                })))
            };

            // Helper to construct delete request
            let delete_request = |title: &str| {
                Request::new(delete_mutation_query).variables(Variables::from_json(json!({
                    "title": title
                })))
            };

            // Step 1: Create a root entry
            let create_response = schema.execute(create_request("new title")).await;

            assert!(
                create_response.errors.is_empty(),
                "Expected no errors during creation, but found: {:?}",
                create_response.errors
            );

            assert_eq!(
                created_entry["title"], "new title",
                "The created entry title does not match"
            );

            // Step 2: Delete the root entry
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

            // Step 3: Verify the entry is gone from the database
            let mut connection = app_state
                .db_pool
                .get()
                .expect("Failed to get DB connection");

            let result = entries
                .filter(id.eq(created_id))
                .first::<Entry>(&mut connection);

            assert!(
                result.is_err(),
                "The entry was not deleted from the database as expected"
            );

            // Step 4: Verify the index is gone
            let index_name = format!("idx_entries_by_root_id_{}", created_id);
            let check_index_query = format!("SELECT to_regclass('{}')", index_name);

            let index_result: Option<String> = diesel::sql_query(check_index_query)
                .get_result::<Option<String>>(&mut connection)
                .expect("Failed to execute index check query");

            assert!(
                index_result.is_none(),
                "The index `{}` was not deleted as expected",
                index_name
            );
        })
    })
    .await;
}

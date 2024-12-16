use async_graphql::{Request, Variables};
use my_project::{graphql::create_schema::create_schema, state::AppState};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    entries::check_entry_in_db::check_entry_in_db,
    load_graphql::{load_graphql, Mutation},
};

#[tokio::test]
async fn test_rename_root_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let mut connection = app_state
                .get_connection()
                .expect("Failed to get DB connection");
            let schema = create_schema(&app_state);

            let create_root_mutation = load_graphql(Mutation::CreateRoot);
            let rename_root_mutation = load_graphql(Mutation::RenameRoot);

            let create_request = |title: &str| {
                Request::new(&create_root_mutation).variables(Variables::from_json(json!({
                    "title": title
                })))
            };

            let rename_request = |old_title: &str, new_title: &str| {
                Request::new(&rename_root_mutation).variables(Variables::from_json(json!({
                    "oldTitle": old_title,
                    "newTitle": new_title
                })))
            };

            // Step 1: Create a root entry
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

            // Step 2: Validate the entry exists in the database
            check_entry_in_db(&mut connection, created_id)
                .expect("Failed to find entry in the database");

            // Step 3: Rename the root entry
            let rename_response = schema
                .execute(rename_request("new title", "different title"))
                .await;

            assert!(
                rename_response.errors.is_empty(),
                "Expected no errors during renaming, but found: {:?}",
                rename_response.errors
            );

            let rename_data = rename_response
                .data
                .into_json()
                .expect("Failed to parse rename response data");
            let renamed_entry = rename_data
                .get("renameRoot")
                .expect("Missing renameRoot field");

            assert_eq!(
                renamed_entry["id"], created_entry["id"],
                "The renamed entry ID does not match the created entry ID"
            );
            assert_eq!(
                renamed_entry["title"], "different title",
                "The renamed entry title does not match the new title"
            );

            // Step 4: Validate the renamed entry exists in the database
            let updated_entry = check_entry_in_db(&mut connection, created_id)
                .expect("Failed to find the renamed entry in the database");

            assert_eq!(
                updated_entry.title, "different title",
                "The title in the database does not match the renamed title"
            );
        })
    })
    .await;
}

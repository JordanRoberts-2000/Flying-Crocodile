use async_graphql::{Request, Variables};
use my_project::{
    graphql::create_schema::create_schema, models::CreateEntryInput, state::AppState,
};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    entries::{check_entry_in_db::check_entry_in_db, check_index_in_db::check_index_in_db},
    load_graphql::{load_graphql, Mutation},
};

#[tokio::test]
async fn test_create_entry_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let mut connection = app_state
                .get_connection()
                .expect("Failed to get DB connection");
            let schema = create_schema(&app_state);

            let mutation_query = load_graphql(Mutation::CreateEntry);

            let create_request = |input: &CreateEntryInput| {
                Request::new(&mutation_query).variables(Variables::from_json(json!({
                    "input": {
                        "title": input.title,
                        "parentId": input.parent_id,
                        "isFolder": input.is_folder,
                        "rootTitle": input.root_title
                    }
                })))
            };

            // Step 1: Create the first root entry
            let root_input = CreateEntryInput {
                title: "Root Entry".to_string(),
                parent_id: None,
                is_folder: true,
                root_title: None,
            };

            let first_response = schema.execute(create_request(&root_input)).await;

            assert!(
                first_response.errors.is_empty(),
                "Expected no errors, but found: {:?}",
                first_response.errors
            );

            let data = first_response
                .data
                .into_json()
                .expect("Failed to parse response data");
            let first_root = data.get("createEntry").expect("Missing createEntry field");

            assert_eq!(
                first_root["title"], "Root Entry",
                "The created root entry title does not match"
            );

            let first_root_id = first_root["id"]
                .as_i64()
                .expect("Created root entry ID should be an integer")
                as i32;

            check_entry_in_db(&mut connection, first_root_id)
                .expect("Failed to find root entry in the database");

            let index_name = format!("idx_entries_by_root_id_{}", first_root_id);
            check_index_in_db(&mut connection, &index_name)
                .expect("Failed to find index in the database");

            // Step 2: Attempt to create a second root entry with the same title
            let duplicate_root_input = CreateEntryInput {
                title: "Root Entry".to_string(),
                parent_id: None,
                is_folder: true,
                root_title: None,
            };

            let second_response = schema.execute(create_request(&duplicate_root_input)).await;

            assert!(
                !second_response.errors.is_empty(),
                "Expected an error due to duplicate root title, but found none"
            );

            // Step 3: Create a child entry under the first root entry
            let child_input = CreateEntryInput {
                title: "Child Entry".to_string(),
                parent_id: Some(first_root_id),
                is_folder: false,
                root_title: Some("Root Entry".to_string()),
            };

            let third_response = schema.execute(create_request(&child_input)).await;

            assert!(
                third_response.errors.is_empty(),
                "Expected no errors, but found: {:?}",
                third_response.errors
            );

            let child_data = third_response
                .data
                .into_json()
                .expect("Failed to parse child entry response data");
            let child_entry = child_data
                .get("createEntry")
                .expect("Missing createEntry field");

            assert_eq!(
                child_entry["title"], "Child Entry",
                "The created child entry title does not match"
            );

            let child_id = child_entry["id"]
                .as_i64()
                .expect("Created child entry ID should be an integer")
                as i32;

            check_entry_in_db(&mut connection, child_id)
                .expect("Failed to find child entry in the database");

            assert_eq!(
                child_entry["parentId"].as_i64().unwrap() as i32,
                first_root_id,
                "The parent ID of the child entry does not match the first root ID"
            );
        })
    })
    .await;
}

use async_graphql::{Request, Variables};
use my_project::{
    graphql::create_schema::create_schema,
    models::{CreateEntryInput, DeleteEntryInput},
    state::AppState,
};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    entries::{check_entry_in_db::check_entry_in_db, check_index_in_db::check_index_in_db},
    load_graphql::{load_graphql, Mutation},
};

#[tokio::test]
async fn test_delete_entry_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let mut connection = app_state
                .get_connection()
                .expect("Failed to get DB connection");
            let schema = create_schema(&app_state);

            let create_mutation_query = load_graphql(Mutation::CreateEntry);
            let delete_mutation_query = load_graphql(Mutation::DeleteEntry);

            let create_request = |input: &CreateEntryInput| {
                Request::new(&create_mutation_query).variables(Variables::from_json(json!({
                    "input": {
                        "title": input.title,
                        "parentId": input.parent_id,
                        "isFolder": input.is_folder,
                        "rootTitle": input.root_title
                    }
                })))
            };

            let delete_request = |input: &DeleteEntryInput| {
                Request::new(&delete_mutation_query).variables(Variables::from_json(json!({
                    "input": {
                        "entryId": input.entry_id,
                        "rootTitle": input.root_title
                    }
                })))
            };

            // Step 1: Create a root entry
            let root_input = CreateEntryInput {
                title: "Root Entry".to_string(),
                parent_id: None,
                is_folder: true,
                root_title: None,
            };

            let root_response = schema.execute(create_request(&root_input)).await;

            assert!(
                root_response.errors.is_empty(),
                "Expected no errors during root creation, but found: {:?}",
                root_response.errors
            );

            let root_data = root_response
                .data
                .into_json()
                .expect("Failed to parse root creation response data");
            let root_entry = root_data
                .get("createEntry")
                .expect("Missing createEntry field");

            let root_id = root_entry["id"]
                .as_i64()
                .expect("Root entry ID should be an integer") as i32;

            check_entry_in_db(&mut connection, root_id)
                .expect("Root entry not found in the database");

            let index_name = format!("idx_entries_by_root_id_{}", root_id);
            check_index_in_db(&mut connection, &index_name)
                .expect("Failed to find index in the database");

            // Step 2: Create two child entries under the root
            let child1_input = CreateEntryInput {
                title: "Child Entry 1".to_string(),
                parent_id: Some(root_id),
                is_folder: false,
                root_title: Some("Root Entry".to_string()),
            };

            let child2_input = CreateEntryInput {
                title: "Child Entry 2".to_string(),
                parent_id: Some(root_id),
                is_folder: false,
                root_title: Some("Root Entry".to_string()),
            };

            let child1_response = schema.execute(create_request(&child1_input)).await;
            assert!(
                child1_response.errors.is_empty(),
                "Expected no errors during child entry 1 creation, but found: {:?}",
                child1_response.errors
            );

            let child2_response = schema.execute(create_request(&child2_input)).await;
            assert!(
                child2_response.errors.is_empty(),
                "Expected no errors during child entry 2 creation, but found: {:?}",
                child2_response.errors
            );

            let child2_data = child2_response
                .data
                .into_json()
                .expect("Failed to parse child entry 2 response data");
            let child2_entry = child2_data
                .get("createEntry")
                .expect("Missing createEntry field");

            let child2_id = child2_entry["id"]
                .as_i64()
                .expect("Child entry 2 ID should be an integer") as i32;

            check_entry_in_db(&mut connection, child2_id)
                .expect("Child entry 2 not found in the database");

            // Step 3: Delete the second child entry
            let delete_child2_input = DeleteEntryInput {
                entry_id: Some(child2_id),
                root_title: "Root Entry".to_string(),
            };

            let delete_child2_response = schema.execute(delete_request(&delete_child2_input)).await;
            assert!(
                delete_child2_response.errors.is_empty(),
                "Expected no errors during child entry 2 deletion, but found: {:?}",
                delete_child2_response.errors
            );

            let child2_check_result = check_entry_in_db(&mut connection, child2_id);
            assert!(
                child2_check_result.is_err(),
                "Child entry 2 still exists in the database after deletion"
            );

            // Step 4: Delete the root entry (cascade deletion)
            let delete_root_input = DeleteEntryInput {
                entry_id: None,
                root_title: "Root Entry".to_string(),
            };

            let delete_root_response = schema.execute(delete_request(&delete_root_input)).await;
            assert!(
                delete_root_response.errors.is_empty(),
                "Expected no errors during root deletion, but found: {:?}",
                delete_root_response.errors
            );

            let root_check_result = check_entry_in_db(&mut connection, root_id);
            assert!(
                root_check_result.is_err(),
                "Root entry still exists in the database after deletion"
            );

            let child1_id = child1_response
                .data
                .into_json()
                .expect("Failed to parse child entry 1 response data")
                .get("createEntry")
                .expect("Missing createEntry field")["id"]
                .as_i64()
                .expect("Child entry 1 ID should be an integer") as i32;

            let child1_check_result = check_entry_in_db(&mut connection, child1_id);
            assert!(
                child1_check_result.is_err(),
                "Child entry 1 still exists in the database after root deletion"
            );

            let old_index_check = check_index_in_db(&mut connection, &index_name);
            assert!(
                old_index_check.is_err(),
                "Expected the old index `{}` to be deleted, but it still exists",
                index_name
            );
        })
    })
    .await;
}

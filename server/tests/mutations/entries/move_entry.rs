use async_graphql::{Request, Variables};
use my_project::{
    graphql::create_schema::create_schema, models::CreateEntryInput, state::AppState,
};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    entries::check_entry_in_db::check_entry_in_db,
    load_graphql::{load_graphql, Mutation},
};

#[tokio::test]
async fn test_move_entry_mutation() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let mut connection = app_state
                .get_connection()
                .expect("Failed to get DB connection");
            let schema = create_schema(&app_state);

            let create_entry_mutation = load_graphql(Mutation::CreateEntry);
            let move_entry_mutation = load_graphql(Mutation::MoveEntry);

            let create_request = |input: &CreateEntryInput| {
                Request::new(&create_entry_mutation).variables(Variables::from_json(json!({
                    "input": {
                        "title": input.title,
                        "parentId": input.parent_id,
                        "isFolder": input.is_folder,
                        "rootTitle": input.root_title
                    }
                })))
            };

            let move_request = |entry_id: i32, new_parent_id: i32| {
                Request::new(&move_entry_mutation).variables(Variables::from_json(json!({
                    "input": {
                        "entryId": entry_id,
                        "newParentId": new_parent_id
                    }
                })))
            };

            // Step 1: Create two root entries
            let root1_input = CreateEntryInput {
                title: "Root 1".to_string(),
                parent_id: None,
                is_folder: true,
                root_title: None,
            };

            let root2_input = CreateEntryInput {
                title: "Root 2".to_string(),
                parent_id: None,
                is_folder: true,
                root_title: None,
            };

            let root1_response = schema.execute(create_request(&root1_input)).await;
            let root2_response = schema.execute(create_request(&root2_input)).await;

            assert!(root1_response.errors.is_empty(), "Failed to create Root 1");
            assert!(root2_response.errors.is_empty(), "Failed to create Root 2");

            let root1_id = root1_response
                .data
                .into_json()
                .expect("Failed to parse Root 1 response")["createEntry"]["id"]
                .as_i64()
                .expect("Root 1 ID should be an integer") as i32;

            let root2_id = root2_response
                .data
                .into_json()
                .expect("Failed to parse Root 2 response")["createEntry"]["id"]
                .as_i64()
                .expect("Root 2 ID should be an integer") as i32;

            // Step 2: Add an entry under the first root
            let child_input = CreateEntryInput {
                title: "Child Entry".to_string(),
                parent_id: Some(root1_id),
                is_folder: false,
                root_title: Some("Root 1".to_string()),
            };

            let child_response = schema.execute(create_request(&child_input)).await;
            assert!(
                child_response.errors.is_empty(),
                "Failed to create child entry: {:?}",
                child_response.errors
            );

            let child_id = child_response
                .data
                .into_json()
                .expect("Failed to parse child entry response")["createEntry"]["id"]
                .as_i64()
                .expect("Child ID should be an integer") as i32;

            check_entry_in_db(&mut connection, child_id)
                .expect("Child entry not found in the database");

            // Step 3: Move the child entry to the second root
            let move_response = schema.execute(move_request(child_id, root2_id)).await;
            assert!(
                move_response.errors.is_empty(),
                "Failed to move entry: {:?}",
                move_response.errors
            );

            let moved_entry = move_response
                .data
                .into_json()
                .expect("Failed to parse move entry response")["moveEntry"]
                .clone();

            assert_eq!(
                moved_entry["parentId"].as_i64().unwrap() as i32,
                root2_id,
                "The parent ID of the moved entry does not match the second root ID"
            );

            // Step 4: Verify the entry's new parent ID in the database
            let updated_entry = check_entry_in_db(&mut connection, child_id)
                .expect("Failed to find the moved entry in the database");

            assert_eq!(
                updated_entry.parent_id.unwrap(),
                root2_id,
                "The database parent ID does not match the new parent ID"
            );

            println!(
                "Entry successfully moved: {:?} -> Parent ID: {}",
                updated_entry.title, root2_id
            );
        })
    })
    .await;
}

use async_graphql::{Request, Variables};
use my_project::{
    graphql::create_schema::create_schema,
    models::{CreateEntryInput, GetEntriesInput},
    state::app_state::AppState,
};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    load_graphql::{load_graphql, Mutation, Query},
};

#[tokio::test]
async fn test_get_entries_query() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let schema = create_schema(&app_state);

            let get_entries_query = load_graphql(Query::GetEntries);
            let create_entry_mutation = load_graphql(Mutation::CreateEntry);

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

            let get_entries_request = |input: &GetEntriesInput| {
                Request::new(&get_entries_query).variables(Variables::from_json(json!({
                    "input": {
                        "rootTitle": input.root_title,
                        "folderId": input.folder_id
                    }
                })))
            };

            // Step 1: Create a root entry
            let root_input = CreateEntryInput {
                title: "initialRoot".to_string(),
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

            // Step 2: Add 3 child entries to the root
            let child_inputs = vec![
                CreateEntryInput {
                    title: "Child 1".to_string(),
                    parent_id: Some(root_id),
                    is_folder: true,
                    root_title: Some("initialRoot".to_string()),
                },
                CreateEntryInput {
                    title: "Child 2".to_string(),
                    parent_id: Some(root_id),
                    is_folder: false,
                    root_title: Some("initialRoot".to_string()),
                },
                CreateEntryInput {
                    title: "Child 3".to_string(),
                    parent_id: Some(root_id),
                    is_folder: false,
                    root_title: Some("initialRoot".to_string()),
                },
            ];

            let mut child_ids = vec![];

            for input in child_inputs {
                let response = schema.execute(create_request(&input)).await;
                assert!(
                    response.errors.is_empty(),
                    "Failed to create child entry: {:?}",
                    response.errors
                );

                let data = response
                    .data
                    .into_json()
                    .expect("Failed to parse child response");
                let entry = data.get("createEntry").expect("Missing createEntry field");
                let entry_id = entry["id"]
                    .as_i64()
                    .expect("Child entry ID should be an integer")
                    as i32;

                child_ids.push(entry_id);
            }

            // Step 3: Add 4 child entries to the first child entry
            let nested_child_inputs = (1..=4)
                .map(|i| CreateEntryInput {
                    title: format!("Nested Child {}", i),
                    parent_id: Some(child_ids[0]),
                    is_folder: false,
                    root_title: Some("initialRoot".to_string()),
                })
                .collect::<Vec<_>>();

            for input in nested_child_inputs {
                let response = schema.execute(create_request(&input)).await;
                assert!(
                    response.errors.is_empty(),
                    "Failed to create nested child entry: {:?}",
                    response.errors
                );
            }

            // Step 4: Fetch all entries of the root
            let get_root_entries_input = GetEntriesInput {
                root_title: "initialRoot".to_string(),
                folder_id: None,
            };

            let root_entries_response = schema
                .execute(get_entries_request(&get_root_entries_input))
                .await;

            assert!(
                root_entries_response.errors.is_empty(),
                "Failed to fetch root entries: {:?}",
                root_entries_response.errors
            );

            let root_entries_data = root_entries_response
                .data
                .into_json()
                .expect("Failed to parse root entries response data");
            let root_entries = root_entries_data
                .get("getEntries")
                .expect("Missing getEntries field");

            let entries = root_entries["entries"]
                .as_array()
                .expect("Entries should be an array");

            assert_eq!(
                entries.len(),
                3,
                "Expected 3 entries under the root folder, but found {}",
                entries.len()
            );

            // Step 5: Fetch all entries of the first child entry
            let get_nested_entries_input = GetEntriesInput {
                root_title: "initialRoot".to_string(),
                folder_id: Some(child_ids[0]),
            };

            let nested_entries_response = schema
                .execute(get_entries_request(&get_nested_entries_input))
                .await;

            assert!(
                nested_entries_response.errors.is_empty(),
                "Failed to fetch nested entries: {:?}",
                nested_entries_response.errors
            );

            let nested_entries_data = nested_entries_response
                .data
                .into_json()
                .expect("Failed to parse nested entries response data");
            let nested_entries = nested_entries_data
                .get("getEntries")
                .expect("Missing getEntries field");

            let entries = nested_entries["entries"]
                .as_array()
                .expect("Entries should be an array");

            assert_eq!(
                entries.len(),
                4,
                "Expected 4 entries under the first child folder, but found {}",
                entries.len()
            );
        })
    })
    .await;
}

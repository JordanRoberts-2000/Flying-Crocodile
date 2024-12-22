use async_graphql::{Request, Variables};
use my_project::{
    graphql::create_schema::create_schema, models::CreateEntryInput, state::app_state::AppState,
};
use serde_json::json;

use crate::helper_functions::{
    db::db_reset,
    load_graphql::{load_graphql, Mutation, Query},
};

#[tokio::test]
async fn test_get_roots_query() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();
            let schema = create_schema(&app_state);

            let create_entry_mutation = load_graphql(Mutation::CreateEntry);
            let get_roots_query = load_graphql(Query::GetRoots);

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

            // Step 1: Manually create 3 root entries
            let root_titles = vec!["Root 1", "Root 2", "Root 3"];
            for title in &root_titles {
                let root_input = CreateEntryInput {
                    title: title.to_string(),
                    parent_id: None,
                    is_folder: true,
                    root_title: None,
                };

                let response = schema.execute(create_request(&root_input)).await;
                assert!(
                    response.errors.is_empty(),
                    "Failed to create root entry `{}`: {:?}",
                    title,
                    response.errors
                );
            }

            // Step 2: Query the roots
            let request = Request::new(&get_roots_query);
            let response = schema.execute(request).await;

            assert!(
                response.errors.is_empty(),
                "Expected no errors during querying roots, but found: {:?}",
                response.errors
            );

            let data = response
                .data
                .into_json()
                .expect("Failed to parse response data");

            let roots = data
                .get("getRoots")
                .expect("Missing getRoots field")
                .as_array()
                .expect("getRoots field is not an array");

            let mut actual_roots: Vec<String> = roots
                .iter()
                .map(|root| {
                    root.as_str()
                        .expect("Root title is not a string")
                        .to_string()
                })
                .collect();

            let mut expected_roots = root_titles.clone();

            actual_roots.sort();
            expected_roots.sort();

            assert_eq!(
                actual_roots, expected_roots,
                "Expected roots {:?}, but got {:?}",
                expected_roots, actual_roots
            );
        })
    })
    .await;
}

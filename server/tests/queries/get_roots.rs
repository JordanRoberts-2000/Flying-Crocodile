use async_graphql::Request;
use my_project::{
    config::constants::INITIAL_ROOT_FOLDERS, graphql::create_schema::create_schema,
    services::root::RootService, state::AppState,
};

use crate::helper_functions::{
    db::db_reset,
    load_graphql::{load_graphql, Query},
};

#[tokio::test]
async fn test_get_roots_query() {
    dotenv::from_filename(".env.test").ok();
    db_reset(|| {
        Box::pin(async {
            let app_state = AppState::initialize();

            // Step 1: Initialize the roots using RootService
            RootService::create_initial_roots(&app_state);

            let schema = create_schema(&app_state);

            // Step 2: Load the GetRoots query
            let get_roots_query = load_graphql(Query::GetRoots);

            // Step 3: Create and execute the GraphQL request
            let request = Request::new(&get_roots_query);

            let response = schema.execute(request).await;

            // Step 4: Validate the response
            assert!(
                response.errors.is_empty(),
                "Expected no errors, but found: {:?}",
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

            // Step 5: Verify the root titles
            let mut actual_roots: Vec<String> = roots
                .iter()
                .map(|root| {
                    root.as_str()
                        .expect("Root title is not a string")
                        .to_string()
                })
                .collect();

            let mut initial_roots = INITIAL_ROOT_FOLDERS.clone();

            assert_eq!(
                actual_roots.sort(),
                initial_roots.sort(),
                "Expected roots {:?}, but got {:?}",
                initial_roots.sort(),
                actual_roots.sort()
            );
        })
    })
    .await;
}

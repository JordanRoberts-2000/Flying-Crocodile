use crate::AppState;
use async_graphql::{Context, Object, Result};
use log::{error, info};
use std::sync::{Arc, Mutex};

#[derive(Default)]
pub struct CategoriesQuery;

#[Object]
impl CategoriesQuery {
    async fn get_categories(&self, ctx: &Context<'_>) -> Result<Vec<String>> {
        Ok(Vec::new())
        // info!("CategoriesQuery hit");

        // let app_state = ctx
        //     .data::<Arc<Mutex<AppState>>>()
        //     .map_err(|e| {
        //         error!("Error - Failed to retrieve AppState from context: {:?}", e);
        //         async_graphql::Error::new("Internal server error")
        //     })
        //     .and_then(|state| {
        //         state.lock().map_err(|e| {
        //             error!("Error - Failed to acquire AppState lock: {:?}", e);
        //             async_graphql::Error::new("Internal server error")
        //         })
        //     })?;

        // let categories = app_state.root_manager.get_categories();

        // info!(
        //     "CategoriesQuery Successful - fetched {} categories",
        //     categories.len()
        // );

        // Ok(categories)
    }
}

use crate::AppState;
use async_graphql::{Context, Object, Result};
use log::{error, info};
use std::sync::Arc;

#[derive(Default)]
pub struct CategoriesQuery;

#[Object]
impl CategoriesQuery {
    async fn get_categories(&self, ctx: &Context<'_>) -> Result<Vec<String>> {
        info!("CategoriesQuery hit");

        let app_state = match ctx.data::<Arc<AppState>>() {
            Ok(app_state) => app_state,
            Err(e) => {
                error!("Failed to retrieve AppState from context: {:?}", e);
                return Err(async_graphql::Error::new("Internal server error"));
            }
        };

        let categories = app_state.root_manager.get_categories();

        Ok(categories)
    }
}

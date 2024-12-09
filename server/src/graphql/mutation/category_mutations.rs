use std::sync::{Arc, Mutex};

use crate::models::Entry;
use crate::AppState;
use async_graphql::{Context, Object, Result};
use log::{error, info};

#[derive(Default)]
pub struct CategoryMutation;

#[Object]
impl CategoryMutation {
    async fn create_category(
        &self,
        ctx: &Context<'_>,
        new_category_title: String,
    ) -> Result<Entry> {
        info!(
            "CategoriesMutation hit - creating category with title: {}",
            new_category_title
        );

        let mut app_state = ctx
            .data::<Arc<Mutex<AppState>>>()
            .map_err(|e| {
                error!("Error - Failed to retrieve AppState from context: {:?}", e);
                async_graphql::Error::new("Internal server error")
            })
            .and_then(|state| {
                state.lock().map_err(|e| {
                    error!("Error - Failed to acquire AppState lock: {:?}", e);
                    async_graphql::Error::new("Internal server error")
                })
            })?;

        app_state
            .root_manager
            .create_root(&new_category_title)
            .map_err(|e| {
                error!(
                    "CategoriesMutation Error - Failed to create category `{}`: {}",
                    new_category_title, e
                );
                async_graphql::Error::new("Internal server error")
            })
    }

    // async fn delete_category(&self, ctx: &Context<'_>, new_entry: NewEntry) -> Result<Entry> {}

    // async fn rename_category(&self, ctx: &Context<'_>, new_entry: NewEntry) -> Result<Entry> {}
}

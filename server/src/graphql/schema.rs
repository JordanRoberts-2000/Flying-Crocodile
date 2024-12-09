use crate::AppState;
use async_graphql::{dataloader::DataLoader, EmptySubscription, Schema};
use std::sync::Arc;

use super::{loaders::EntryLoader, mutation::RootMutation, query::RootQuery};

pub type AppSchema = Schema<RootQuery, RootMutation, EmptySubscription>;

pub fn create_schema(app_state: Arc<AppState>) -> AppSchema {
    let entry_loader = DataLoader::new(
        EntryLoader {
            db_pool: app_state.db_pool.clone(),
        },
        tokio::spawn,
    );

    Schema::build(
        RootQuery::default(),
        RootMutation::default(),
        EmptySubscription,
    )
    .data(app_state)
    .data(entry_loader)
    .finish()
}

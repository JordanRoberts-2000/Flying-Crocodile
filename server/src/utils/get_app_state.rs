use async_graphql::{Context, Error};
use log::error;
use std::sync::{Arc, Mutex};

use crate::AppState;

pub fn get_app_state<'a>(
    ctx: &'a Context<'_>,
    title: &str,
) -> Result<std::sync::MutexGuard<'a, AppState>, Error> {
    ctx.data::<Arc<Mutex<AppState>>>()
        .map_err(|e| {
            error!(
                "{} - Failed to retrieve AppState from context: {:?}",
                title, e
            );
            Error::new("Internal server error")
        })
        .and_then(|state| {
            state.lock().map_err(|e| {
                error!("{} - Failed to acquire AppState lock: {:?}", title, e);
                Error::new("Internal server error")
            })
        })
}

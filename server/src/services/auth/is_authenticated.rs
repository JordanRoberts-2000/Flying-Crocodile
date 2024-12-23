use std::sync::Arc;

use actix_web::HttpRequest;
use log::info;

use crate::{models::auth::github::GitHubUser, state::app_state::AppState};

use super::AuthService;

impl AuthService {
    pub fn is_authenticated(
        req: &HttpRequest,
        app_state: &Arc<AppState>,
    ) -> Result<Option<GitHubUser>, String> {
        if let Some(session_id) = req.cookie("session_id") {
            let session_result = app_state.session_store.get_session(session_id.value())?;

            if let Some(session_data) = session_result {
                return Ok(Some(session_data.user));
            } else {
                return Ok(None);
            }
        }

        let eee = req.cookie("session_id");

        info!("Session cookie: {:?}", eee);

        info!("Session ID cookie not found");
        Ok(None)
    }
}

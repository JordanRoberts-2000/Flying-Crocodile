use actix_web::{web, Error, HttpRequest, HttpResponse};
use std::sync::Arc;

use crate::{config::logging::Log, services::auth::AuthService, state::app_state::AppState};

pub async fn admin_check(
    req: HttpRequest,
    app_state: web::Data<Arc<AppState>>,
) -> Result<HttpResponse, Error> {
    let user = AuthService::is_authenticated(&req, &app_state).map_err(|err| {
        Log::error(&req, &format!("Failed to check authentication: {}", err));
        actix_web::error::ErrorInternalServerError("Internal server error")
    })?;

    if user.is_none() {
        return Ok(HttpResponse::Ok().json(serde_json::json!({"admin": false})));
    }

    Ok(HttpResponse::Ok().json(serde_json::json!({"admin": user})))
}

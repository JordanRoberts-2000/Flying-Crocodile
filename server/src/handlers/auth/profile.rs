use std::sync::Arc;

use actix_web::{web, Error, HttpRequest, HttpResponse};
use log::{error, info};

use crate::{services::auth::AuthService, state::app_state::AppState};

pub async fn profile(
    req: HttpRequest,
    app_state: web::Data<Arc<AppState>>,
) -> Result<HttpResponse, Error> {
    info!("/auth/profile hit");

    let user = AuthService::is_authenticated(&req, &app_state).map_err(|err| {
        error!("Profile - Failed to check authentication: {}", err);
        actix_web::error::ErrorInternalServerError("Internal server error")
    })?;

    if user.is_none() {
        return Ok(HttpResponse::Unauthorized().body("User is not authenticated"));
    }

    Ok(HttpResponse::Ok().json(user))
}

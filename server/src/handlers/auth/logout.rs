use actix_web::{
    cookie::{time, Cookie},
    web, HttpRequest, HttpResponse,
};
use std::sync::Arc;

use crate::{config::logging::Log, state::app_state::AppState};

pub async fn logout(req: HttpRequest, app_state: web::Data<Arc<AppState>>) -> HttpResponse {
    if let Some(cookie) = req.cookie("session_id") {
        let session_id = cookie.value();

        if let Err(err) = app_state.session_store.remove_session(session_id) {
            Log::error(&req, &format!("Failed to remove session: {}", err));
            return HttpResponse::InternalServerError().body("Internal server error");
        }

        Log::info(&req, "Session successfully removed");
    } else {
        Log::info(&req, "No session cookie found");
    }

    let expired_cookie = Cookie::build("session_id", "")
        .http_only(true)
        .secure(false) // Set to true in production for HTTPS
        .path("/")
        .expires(time::OffsetDateTime::now_utc() - time::Duration::days(1)) // Expire immediately
        .finish();

    HttpResponse::Ok()
        .cookie(expired_cookie)
        .body("Logged out successfully")
}

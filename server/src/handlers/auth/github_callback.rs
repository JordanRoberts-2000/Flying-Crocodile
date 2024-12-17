use std::sync::Arc;

use actix_web::{web, HttpResponse, Responder};
use log::info;

use crate::AppState;

pub async fn github_callback(app_state: web::Data<Arc<AppState>>) -> impl Responder {
    info!("GitHub callback endpoint hit.");

    HttpResponse::Ok().json({
        serde_json::json!({
            "hello": "jimboy",
        })
    })
}

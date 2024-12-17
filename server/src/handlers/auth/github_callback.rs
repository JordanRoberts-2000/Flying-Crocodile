use std::sync::{Arc, Mutex};

use actix_web::{web, HttpResponse, Responder};
use log::info;

use crate::AppState;

pub async fn github_callback(state: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    info!("GitHub callback endpoint hit.");

    HttpResponse::Ok().json({
        serde_json::json!({
            "hello": "jimboy",
        })
    })
}

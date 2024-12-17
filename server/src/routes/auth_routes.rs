use actix_web::web;

use crate::handlers::auth::{github_auth::github_auth, github_callback::github_callback};

pub fn auth_routes(config: &mut web::ServiceConfig) {
    config.service(
        web::scope("/auth")
            .route("/github", web::get().to(github_auth))
            .route("/github/callback", web::get().to(github_callback)), // .route("/apple", web::get().to(apple_auth))
                                                                        // .route("/apple/callback", web::post().to(apple_callback)),
    );
}

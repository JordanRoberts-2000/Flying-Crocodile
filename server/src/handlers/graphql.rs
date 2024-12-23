use actix_web::{web, HttpRequest, HttpResponse, Result};
use async_graphql::http::GraphiQLSource;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use log::error;
use std::{env, sync::Arc};

use crate::{
    config::logging::Log, graphql::create_schema::AppSchema, services::auth::AuthService,
    state::app_state::AppState,
};

pub async fn graphql_handler(
    schema: web::Data<AppSchema>,
    app_state: web::Data<Arc<AppState>>,
    req: HttpRequest,
    gql_req: GraphQLRequest,
) -> GraphQLResponse {
    let admin = match AuthService::is_authenticated(&req, &app_state) {
        Ok(user) => user,
        Err(err) => {
            error!("Failed to authenticate user: {}", err);
            None
        }
    };

    schema
        .execute(gql_req.into_inner().data(admin.clone()))
        .await
        .into()
}

pub async fn index_graphiql(req: HttpRequest) -> Result<HttpResponse> {
    let environment = env::var("ENVIRONMENT").unwrap_or_else(|_| {
        Log::warn(
            &req,
            "ENVIRONMENT not set in .env, defaulting to 'development'",
        );
        "development".to_string()
    });

    if environment == "development" {
        Ok(HttpResponse::Ok()
            .content_type("text/html; charset=utf-8")
            .body(GraphiQLSource::build().endpoint("/graphql").finish()))
    } else {
        Ok(HttpResponse::NotFound().body("Not Found"))
    }
}

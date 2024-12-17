use actix_web::{web, HttpResponse, Result};
use async_graphql::http::GraphiQLSource;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use std::env;

use crate::graphql::create_schema::AppSchema;

pub async fn graphql_handler(schema: web::Data<AppSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

pub async fn index_graphiql() -> Result<HttpResponse> {
    if env::var("ENVIRONMENT").unwrap_or_else(|_| "production".to_string()) == "development" {
        Ok(HttpResponse::Ok()
            .content_type("text/html; charset=utf-8")
            .body(GraphiQLSource::build().endpoint("/graphql").finish()))
    } else {
        Ok(HttpResponse::NotFound().body("Not Found"))
    }
}

use actix_web::{web, HttpResponse, Result};
use async_graphql::http::GraphiQLSource;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use create_schema::AppSchema;

pub mod create_schema;
pub mod loaders;
pub mod mutations;
pub mod queries;

pub async fn graphql_handler(schema: web::Data<AppSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

pub async fn index_graphiql() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(GraphiQLSource::build().endpoint("/graphql").finish()))
}

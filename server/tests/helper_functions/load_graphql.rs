use std::fs;
use std::path::Path;

pub enum Mutation {
    CreateRoot,
    DeleteRoot,
}

pub enum Query {
    GetRoots,
}

pub enum GraphQLType {
    Mutation(Mutation),
    Query(Query),
}

impl From<Mutation> for GraphQLType {
    fn from(mutation: Mutation) -> Self {
        GraphQLType::Mutation(mutation)
    }
}

impl From<Query> for GraphQLType {
    fn from(query: Query) -> Self {
        GraphQLType::Query(query)
    }
}

pub fn load_graphql(graphql_type: impl Into<GraphQLType>) -> String {
    let file_name = match graphql_type.into() {
        GraphQLType::Mutation(mutation) => match mutation {
            Mutation::CreateRoot => "mutations/create_root.graphql",
            Mutation::DeleteRoot => "mutations/delete_root.graphql",
        },
        GraphQLType::Query(query) => match query {
            Query::GetRoots => "queries/get_roots.graphql",
        },
    };

    let path = Path::new("tests/graphql").join(file_name);
    fs::read_to_string(&path)
        .unwrap_or_else(|e| panic!("Failed to load GraphQL file from {:?}: {}", &path, e))
}

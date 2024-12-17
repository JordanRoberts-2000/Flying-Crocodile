use std::fs;
use std::path::Path;

pub enum Mutation {
    CreateEntry,
    DeleteEntry,
    RenameEntry,
}

pub enum Query {
    GetRoots,
    GetEntries,
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
            Mutation::CreateEntry => "mutations/create_entry.graphql",
            Mutation::DeleteEntry => "mutations/delete_entry.graphql",
            Mutation::RenameEntry => "mutations/rename_entry.graphql",
        },
        GraphQLType::Query(query) => match query {
            Query::GetRoots => "queries/get_roots.graphql",
            Query::GetEntries => "queries/get_entries.graphql",
        },
    };

    let path = Path::new("tests/graphql").join(file_name);
    fs::read_to_string(&path)
        .unwrap_or_else(|e| panic!("Failed to load GraphQL file from {:?}: {}", &path, e))
}

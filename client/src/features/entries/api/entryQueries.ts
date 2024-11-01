import { graphql } from "../../../gql/gql";

export const getEntries = graphql(`
  query GetEntries {
    getEntries {
      id
      title
      isFolder
    }
  }
`);

export const createEntry = graphql(`
  mutation CreateEntry($newEntry: NewEntry!) {
    createEntry(newEntry: $newEntry) {
      parentId
      title
      isFolder
    }
  }
`);

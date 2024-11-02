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

export const deleteEntry = graphql(`
  mutation DeleteEntry($entryId: Int!) {
    deleteEntry(entryId: $entryId) {
      id
    }
  }
`);

export const updateEntry = graphql(`
  mutation UpdateEntry($entryId: Int!, $newTitle: String!) {
    updateEntry(entryId: $entryId, newTitle: $newTitle) {
      id
      title
    }
  }
`);

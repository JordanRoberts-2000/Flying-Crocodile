import { graphql } from "../../../gql/gql";

export const getRootEntry = graphql(`
  query GetRootEntry($title: String!) {
    getRootEntries(title: $title) {
      rootId
      entries {
        id
        title
        isFolder
      }
    }
  }
`);

export const getEntries = graphql(`
  query GetEntries($parentId: Int) {
    getEntries(parentId: $parentId) {
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

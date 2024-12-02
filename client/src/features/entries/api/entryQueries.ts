import request from "graphql-request";
import { graphql } from "../../../gql/gql";
import { API_BASE_URL } from "@/constants";
import { GetRootEntryQuery, GetRootEntryQueryVariables } from "@/gql/graphql";
import sortEntries from "../utils/sortEntries";
import { QueryClient } from "@tanstack/react-query";

const getRootEntry = graphql(`
  query GetRootEntry($title: String!) {
    getRootEntries(title: $title) {
      rootId
      entries {
        id
        title
        isFolder
        parentId
      }
    }
  }
`);

export const fetchRootEntry = async (
  title: string,
  queryClient: QueryClient
) => {
  const data = await request<GetRootEntryQuery, GetRootEntryQueryVariables>(
    API_BASE_URL,
    getRootEntry,
    { title }
  );

  const { rootId, entries } = data.getRootEntries;
  console.log(entries, rootId);
  queryClient.setQueryData(["entries", rootId], sortEntries(entries));

  return rootId;
};

export const getEntries = graphql(`
  query GetEntries($parentId: Int) {
    getEntries(parentId: $parentId) {
      id
      title
      isFolder
      parentId
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

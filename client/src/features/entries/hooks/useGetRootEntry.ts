import { getRootEntry } from "@/features/entries/api/entryQueries";
import {
  GetRootEntryQuery,
  GetRootEntryQueryVariables,
  RootEntry,
} from "@/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import sortEntries from "../utils/sortEntries";
import { API_BASE_URL } from "@/constants";

const useGetRootEntries = (title: string) => {
  return useQuery<RootEntry, Error>({
    queryKey: [title],
    queryFn: async () => {
      const data = await request<GetRootEntryQuery, GetRootEntryQueryVariables>(
        API_BASE_URL,
        getRootEntry,
        {
          title,
        }
      );
      return {
        ...data.getRootEntries,
        entries: sortEntries(data.getRootEntries.entries),
      };
    },
  });
};

export default useGetRootEntries;

import { getEntries } from "@/features/entries/api/entryQueries";
import {
  Entry,
  GetEntriesQuery,
  GetEntriesQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import sortEntries from "../utils/sortEntries";
import { API_BASE_URL } from "@/constants";
import { QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";

const useGetEntries = (queryPath: QueryPath) => {
  const rootId = queryPath[1];
  return useQuery<Entry[], Error>({
    queryKey: queryPath,
    queryFn: async () => {
      const data = await request<GetEntriesQuery, GetEntriesQueryVariables>(
        API_BASE_URL,
        getEntries,
        {
          parentId: getEntryId(queryPath),
        }
      );
      return sortEntries(data.getEntries);
    },
    enabled: rootId !== undefined && getEntryId(queryPath) !== -1,
  });
};

export default useGetEntries;

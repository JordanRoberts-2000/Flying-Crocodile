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
import useErrorNotification from "./useErrorNotification";
import { QueryPath } from "../entryTypes";
import { getEntryId } from "../utils/getEntryId";

const useGetEntries = (queryKey: QueryPath) => {
  const entryId = getEntryId(queryKey);
  const res = useQuery<Entry[], Error>({
    queryKey,
    queryFn: async () => {
      const data = await request<GetEntriesQuery, GetEntriesQueryVariables>(
        API_BASE_URL,
        getEntries,
        {
          parentId: entryId,
        }
      );
      return sortEntries(data.getEntries);
    },
    enabled: entryId !== undefined && entryId !== -1,
  });

  useErrorNotification(
    res.isError,
    `Error getting entries from id: "${entryId}"`
  );

  return res;
};

export default useGetEntries;

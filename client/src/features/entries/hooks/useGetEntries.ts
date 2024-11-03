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

const useGetEntries = (parentId: number[]) => {
  return useQuery<Entry[], Error>({
    queryKey: ["gallery", ...parentId],
    queryFn: async () => {
      const data = await request<GetEntriesQuery, GetEntriesQueryVariables>(
        API_BASE_URL,
        getEntries,
        {
          parentId: parentId[parentId.length - 1],
        }
      );
      return sortEntries(data.getEntries);
    },
  });
};

export default useGetEntries;

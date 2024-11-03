import { getRootEntry } from "@/features/entries/api/entryQueries";
import {
  GetRootEntryQuery,
  GetRootEntryQueryVariables,
  RootEntry,
} from "@/gql/graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "graphql-request";
import sortEntries from "../utils/sortEntries";
import { API_BASE_URL } from "@/constants";

const useGetRootEntries = (title: string) => {
  const queryClient = useQueryClient();
  return useQuery<RootEntry["rootId"], Error>({
    queryKey: [title],
    queryFn: async () => {
      const data = await request<GetRootEntryQuery, GetRootEntryQueryVariables>(
        API_BASE_URL,
        getRootEntry,
        {
          title,
        }
      );

      const { rootId, entries } = data.getRootEntries;
      queryClient.setQueryData(["gallery", rootId], sortEntries(entries));

      return rootId;
    },
  });
};

export default useGetRootEntries;

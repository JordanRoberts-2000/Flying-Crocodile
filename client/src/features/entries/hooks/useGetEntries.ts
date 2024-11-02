import { getEntries } from "@/features/entries/api/entryQueries";
import { Entry, GetEntriesQuery } from "@/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import sortEntries from "../utils/sortEntries";
import { API_BASE_URL } from "@/constants";

const useGetEntries = () => {
  return useQuery<Entry[], Error>({
    queryKey: ["entries"],
    queryFn: async () => {
      const data = await request<GetEntriesQuery>(API_BASE_URL, getEntries);
      return sortEntries(data.getEntries);
    },
  });
};

export default useGetEntries;

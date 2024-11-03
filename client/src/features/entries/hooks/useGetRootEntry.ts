import { fetchRootEntry } from "@/features/entries/api/entryQueries";
import { RootEntry } from "@/gql/graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useGetRootEntries = (title: string) => {
  const queryClient = useQueryClient();
  return useQuery<RootEntry["rootId"], Error>({
    queryKey: [title],
    queryFn: () => fetchRootEntry(title, queryClient),
  });
};

export default useGetRootEntries;

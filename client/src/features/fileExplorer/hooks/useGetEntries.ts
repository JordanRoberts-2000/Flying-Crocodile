import { fetchRootEntry } from "@/features/fileExplorer/api/entryQueries";
import { Entry, RootEntry } from "@/gql/graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useErrorNotification from "./useErrorNotification";

type RootEntriesData =
  | { isPending: true; isError: false; data: undefined }
  | { isPending: false; isError: true; data: undefined }
  | { isPending: false; isError: false; data: number };

const useGetEntries = (title: string): RootEntriesData => {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery<RootEntry["rootId"], Error>({
    queryKey: ["entries", title],
    queryFn: () => fetchRootEntry(title, queryClient),
  });

  useErrorNotification(isError, `Error getting root folder: "${title}"`);

  if (isPending) {
    return {
      isPending: true,
      isError: false,
      data: undefined,
    };
  } else if (isError) {
    return {
      isPending: false,
      isError: true,
      data: undefined,
    };
  } else {
    return { isPending: false, isError: false, data };
  }
};

export default useGetEntries;

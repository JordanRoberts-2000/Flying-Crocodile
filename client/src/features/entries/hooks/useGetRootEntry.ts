import { fetchRootEntry } from "@/features/entries/api/entryQueries";
import { Entry, RootEntry } from "@/gql/graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetEntries from "./useGetEntries";
import useErrorNotification from "./useErrorNotification";

type RootEntriesData =
  | { isPending: true; isError: false; rootId: undefined; entries: undefined }
  | { isPending: false; isError: true; rootId: undefined; entries: undefined }
  | { isPending: false; isError: false; rootId: number; entries: Entry[] };

const useGetRootEntries = (title: string): RootEntriesData => {
  const queryClient = useQueryClient();

  const {
    data: rootId,
    isPending: rootPending,
    isError: rootErr,
  } = useQuery<RootEntry["rootId"], Error>({
    queryKey: [title],
    queryFn: () => fetchRootEntry(title, queryClient),
  });

  const {
    data: entries,
    isPending: entriesPending,
    isError: entriesErr,
  } = useGetEntries([title, rootId]);

  useErrorNotification(rootErr, `Error getting root folder: "${title}"`);

  const isPending = rootPending || entriesPending;
  const isError = rootErr || entriesErr;

  if (isPending) {
    return {
      isPending: true,
      isError: false,
      rootId: undefined,
      entries: undefined,
    };
  } else if (isError) {
    return {
      isPending: false,
      isError: true,
      rootId: undefined,
      entries: undefined,
    };
  } else {
    return { isPending: false, isError: false, entries, rootId };
  }
};

export default useGetRootEntries;

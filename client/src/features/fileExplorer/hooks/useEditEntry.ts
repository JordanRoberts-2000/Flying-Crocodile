import request from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEntry } from "@/features/fileExplorer/api/entryQueries";
import { API_BASE_URL } from "@/constants";
import { Entry } from "@/gql/graphql";
import sortEntries from "../utils/sortEntries";
import { toast } from "sonner";
import { getEntryId } from "../utils/getEntryId";
import { QueryPath } from "../entryTypes";
import { useEntryStore } from "../store/EntryStoreProvider";

type MutationVariables = {
  queryPath: QueryPath;
  parentQueryPath: QueryPath;
  newTitle: string;
};

const useUpdateEntry = () => {
  const queryClient = useQueryClient();
  const setInputActive = useEntryStore(
    (store) => store.modifyEntry.actions.setInputActive
  );

  return useMutation({
    mutationFn: async ({ queryPath, newTitle }: MutationVariables) => {
      const entryId = getEntryId(queryPath);
      return request(API_BASE_URL, updateEntry, {
        entryId,
        newTitle,
      });
    },
    onMutate: async ({ queryPath, parentQueryPath, newTitle }) => {
      const entryId = getEntryId(queryPath);
      await queryClient.cancelQueries({ queryKey: parentQueryPath });

      const previousEntries =
        queryClient.getQueryData<Entry[]>(parentQueryPath);

      if (previousEntries) {
        queryClient.setQueryData<Entry[]>(parentQueryPath, (old) =>
          old
            ? sortEntries(
                old.map((entry) =>
                  entry.id !== entryId ? entry : { ...entry, title: newTitle }
                )
              )
            : []
        );
        setInputActive("edit", false);
      }
      return { previousEntries };
    },
    onError: (_error, { parentQueryPath }, context) => {
      toast.error("Entry edit failed");
      if (context?.previousEntries) {
        queryClient.setQueryData(parentQueryPath, context.previousEntries);
      }
    },
    onSuccess: () => {
      toast.success("Entry edited successfully");
    },
    onSettled: (_data, _error, { parentQueryPath }) => {
      queryClient.invalidateQueries({ queryKey: parentQueryPath });
    },
  });
};

export default useUpdateEntry;

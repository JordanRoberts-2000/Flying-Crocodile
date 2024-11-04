import request from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";
import { QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";
import { Entry } from "@/gql/graphql";
import sortEntries from "../utils/sortEntries";
import { toast } from "sonner";

type MutationVariables = {
  queryPath: QueryPath;
  newTitle: string;
  setEditingActive?: React.Dispatch<React.SetStateAction<boolean>>;
};

const useUpdateEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ queryPath, newTitle }: MutationVariables) => {
      return request(API_BASE_URL, updateEntry, {
        entryId: getEntryId(queryPath),
        newTitle,
      });
    },
    onMutate: async ({ queryPath, newTitle, setEditingActive }) => {
      const parentQueryPath = queryPath.slice(0, -1);
      await queryClient.cancelQueries({ queryKey: parentQueryPath });

      const previousEntries =
        queryClient.getQueryData<Entry[]>(parentQueryPath);

      if (previousEntries) {
        queryClient.setQueryData<Entry[]>(parentQueryPath, (old) =>
          old
            ? sortEntries(
                old.map((entry) =>
                  entry.id !== getEntryId(queryPath)
                    ? entry
                    : { ...entry, title: newTitle }
                )
              )
            : []
        );
        if (setEditingActive) setEditingActive(false);
      }
      return { previousEntries };
    },
    onError: (_error, { queryPath }, context) => {
      toast.error("Entry edit failed");
      if (context?.previousEntries) {
        queryClient.setQueryData(
          queryPath.slice(0, -1),
          context.previousEntries
        );
      }
    },
    onSuccess: () => {
      toast.success("Entry edited successfully");
    },
    onSettled: (_data, _error, { queryPath }) => {
      queryClient.invalidateQueries({ queryKey: queryPath.slice(0, -1) });
    },
  });
};

export default useUpdateEntry;

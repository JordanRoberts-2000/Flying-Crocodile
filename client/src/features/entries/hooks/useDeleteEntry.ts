import request from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";
import { Entry } from "@/gql/graphql";
import { toast } from "sonner";
import { QueryPath } from "../entryTypes";
import { getEntryId } from "../utils/getEntryId";

const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      queryPath,
    }: {
      queryPath: QueryPath;
      parentQueryPath: QueryPath;
    }) => {
      const entryId = getEntryId(queryPath);
      return request(API_BASE_URL, deleteEntry, {
        entryId,
      });
    },
    onMutate: async ({ queryPath, parentQueryPath }) => {
      const entryId = getEntryId(queryPath);
      await queryClient.cancelQueries({ queryKey: parentQueryPath });

      const previousEntries =
        queryClient.getQueryData<Entry[]>(parentQueryPath);

      if (previousEntries) {
        queryClient.setQueryData<Entry[]>(parentQueryPath, (old) =>
          old ? old.filter((entry) => entry.id !== entryId) : []
        );
      }
      return { previousEntries };
    },
    onError: (_error, { parentQueryPath }, context) => {
      toast.error("Entry deletion failed");
      if (context?.previousEntries) {
        queryClient.setQueryData(parentQueryPath, context.previousEntries);
      }
    },
    onSuccess: (_newData, { queryPath }) => {
      toast.success("Entry deleted successfully");
      queryClient.removeQueries({ queryKey: queryPath });
    },
    onSettled: (_data, _error, { parentQueryPath }) => {
      queryClient.invalidateQueries({ queryKey: parentQueryPath });
    },
  });
};

export default useDeleteEntry;

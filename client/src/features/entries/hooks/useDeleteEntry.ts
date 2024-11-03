import request from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";
import { QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";
import { Entry } from "@/gql/graphql";

const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (queryPath: QueryPath) => {
      return request(API_BASE_URL, deleteEntry, {
        entryId: getEntryId(queryPath),
      });
    },
    onMutate: async (queryPath) => {
      const parentQueryPath = queryPath.slice(0, -1);
      await queryClient.cancelQueries({ queryKey: parentQueryPath });

      const previousEntries =
        queryClient.getQueryData<Entry[]>(parentQueryPath);

      if (previousEntries) {
        queryClient.setQueryData<Entry[]>(parentQueryPath, (old) =>
          old ? old.filter((entry) => entry.id !== getEntryId(queryPath)) : []
        );
      }
      return { previousEntries };
    },
    onError: (error, queryPath, context) => {
      console.log(error);
      // toast({
      //   title: "Deletion Failed",
      //   description: error instanceof Error ? error.message : "An unknown error occurred",
      //   status: "error",
      // });

      if (context?.previousEntries) {
        queryClient.setQueryData(
          queryPath.slice(0, -1),
          context.previousEntries
        );
      }
    },
    onSuccess: (_newData, queryPath) => {
      queryClient.removeQueries({ queryKey: queryPath });
    },
    onSettled: (_data, _error, queryPath) => {
      queryClient.invalidateQueries({ queryKey: queryPath.slice(0, -1) });
    },
  });
};

export default useDeleteEntry;

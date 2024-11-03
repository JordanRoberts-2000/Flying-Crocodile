// src/features/entries/hooks/useDeleteEntry.ts
import request from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";

type DeleteMutationVariables = { entryId: number; parentId: number };

const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ entryId }: DeleteMutationVariables) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return request(API_BASE_URL, deleteEntry, { entryId });
    },
    onMutate: async (variables) => {
      //await queryClient.cancelQueries(['tasks', listId]);
      // remove deleted entry
      // return old data
    },
    onError: (error) => {
      // shadcn notify with toast
      // setState to old state
    },
    onSuccess: () => {
      // remove queries and sub queries
      // id should be an array i think
      // queryClient.invalidateQueries({ queryKey: ["gallery", ...parentId] });
    },
  });
};

export default useDeleteEntry;

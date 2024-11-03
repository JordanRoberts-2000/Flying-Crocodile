import request from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";
import { QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";
import { Entry } from "@/gql/graphql";
import sortEntries from "../utils/sortEntries";

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
    onError: (error, { queryPath }, context) => {
      console.log(error);
      // toast({
      //   title: "Edit Failed",
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
    onSettled: (_data, _error, { queryPath }) => {
      queryClient.invalidateQueries({ queryKey: queryPath.slice(0, -1) });
    },
  });
};

export default useUpdateEntry;

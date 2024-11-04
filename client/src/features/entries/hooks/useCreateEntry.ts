import request from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Entry, NewEntry } from "../../../gql/graphql";
import { createEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";
import { AddingEntry, QueryPath } from "../entryTypes";
import sortEntries from "../utils/sortEntries";
import { toast } from "sonner";

type Variables = {
  newEntry: NewEntry;
  queryPath: QueryPath;
  setAddingEntry?: React.Dispatch<React.SetStateAction<AddingEntry>>;
};

const useCreateEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newEntry }: Variables) => {
      return request(API_BASE_URL, createEntry, { newEntry });
    },
    onMutate: async ({ queryPath, newEntry, setAddingEntry }) => {
      await queryClient.cancelQueries({ queryKey: queryPath });

      const previousEntries = queryClient.getQueryData<Entry[]>(queryPath);
      if (previousEntries) {
        queryClient.setQueryData<Entry[]>(queryPath, (old) =>
          sortEntries([...(old || []), { ...newEntry, id: -1 }])
        );
        if (setAddingEntry) setAddingEntry(false);
      }
      return { previousEntries };
    },
    onError: (_error, { queryPath }, context) => {
      toast.error("Entry creation failed");
      if (context?.previousEntries) {
        queryClient.setQueryData(queryPath, context.previousEntries);
      }
    },
    onSuccess: () => {
      toast.success("Entry created successfully");
    },
    onSettled: (_data, _error, { queryPath }) => {
      queryClient.invalidateQueries({ queryKey: queryPath });
    },
  });
};

export default useCreateEntry;

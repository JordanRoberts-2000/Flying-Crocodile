import request from "graphql-request";
import { useMutation } from "@tanstack/react-query";
import {
  CreateEntryMutation,
  CreateEntryMutationVariables,
} from "../../../gql/graphql";
import { createEntry } from "@/features/entries/api/entryQueries";

const useCreateEntry = () => {
  return useMutation<CreateEntryMutation, Error, CreateEntryMutationVariables>({
    mutationFn: async (variables) => {
      return request("http://localhost:3000/graphql", createEntry, variables);
    },
  });
};

export default useCreateEntry;

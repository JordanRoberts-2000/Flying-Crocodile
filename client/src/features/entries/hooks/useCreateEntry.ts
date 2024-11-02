import request from "graphql-request";
import { useMutation } from "@tanstack/react-query";
import {
  CreateEntryMutation,
  CreateEntryMutationVariables,
} from "../../../gql/graphql";
import { createEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";

const useCreateEntry = () => {
  return useMutation<CreateEntryMutation, Error, CreateEntryMutationVariables>({
    mutationFn: async (variables) => {
      return request(API_BASE_URL, createEntry, variables);
    },
  });
};

export default useCreateEntry;

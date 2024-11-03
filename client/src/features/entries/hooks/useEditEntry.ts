import request from "graphql-request";
import { useMutation } from "@tanstack/react-query";
import { updateEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";

const useUpdateEntry = () => {
  return useMutation({
    mutationFn: async ({
      entryId,
      newTitle,
    }: {
      entryId: number;
      newTitle: string;
    }) => {
      return request(API_BASE_URL, updateEntry, { entryId, newTitle });
    },
    onError: () => {
      console.log("Edit failed");
    },
    onSuccess: () => {
      console.log("edit successful");
    },
  });
};

export default useUpdateEntry;

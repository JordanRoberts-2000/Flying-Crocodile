// src/features/entries/hooks/useDeleteEntry.ts
import request from "graphql-request";
import { useMutation } from "@tanstack/react-query";
import { deleteEntry } from "@/features/entries/api/entryQueries";
import { API_BASE_URL } from "@/constants";

const useDeleteEntry = () => {
  return useMutation({
    mutationFn: async (entryId: number) => {
      return request(API_BASE_URL, deleteEntry, { entryId });
    },
    onError: (error) => {
      console.error("Error deleting entry:", error);
    },
    onSuccess: () => {
      console.log("Entry deleted successfully");
    },
  });
};

export default useDeleteEntry;

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Entry } from "@/gql/graphql";
// import { toast } from "sonner";
// import sortEntries from "../utils/sortEntries";
// import { QueryPath } from "../entryTypes";

// const useMoveEntry = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({}: {
//       queryPath: QueryPath,
//       moveToQueryPath: QueryPath,
//       title: string,
//       isFolder: boolean,
//     }) => {
//       await new Promise((resolve) => setTimeout(resolve, 4000));
//       console.log("mutate fn after delay");
//       throw new Error("Invalid");
//       // return request(API_BASE_URL, createEntry, { newEntry });
//     },
//     onMutate: async ({ isFolder }) => {

//       await queryClient.cancelQueries({ queryKey: [TEMP_ROOT_NAME, parentId] });
//       if (isFolder) {

//       }
//       await queryClient.cancelQueries({
//         queryKey: [TEMP_ROOT_NAME, moveToParentId],
//       });

//       const previousEntries = queryClient.getQueryData<Entry[]>([
//         TEMP_ROOT_NAME,
//         parentId,
//       ]);
//       const previousMoveToEntries = queryClient.getQueryData<Entry[]>([
//         TEMP_ROOT_NAME,
//         moveToParentId,
//       ]);
//       if (previousEntries && previousMoveToEntries) {
//         queryClient.setQueryData<Entry[]>([TEMP_ROOT_NAME, parentId], (old) =>
//           old ? old.filter((entry) => entry.id !== entryId) : []
//         );

//         queryClient.setQueryData<Entry[]>(
//           [TEMP_ROOT_NAME, moveToParentId],
//           (old) =>
//             sortEntries([
//               ...(old || []),
//               {
//                 parentId: moveToEntryId,
//                 isFolder,
//                 title,
//                 id: -1,
//               },
//             ])
//         );
//       }

//       return { previousEntries, previousMoveToEntries };
//     },
//     onError: (_error, { entry, moveToEntry }, context) => {
//       const { parentId } = entry;
//       const { entryId: moveToEntryId } = moveToEntry;
//       toast.error("Entry move failed");
//       if (context?.previousEntries && context?.previousMoveToEntries) {
//         queryClient.setQueryData(
//           [TEMP_ROOT_NAME, moveToEntryId],
//           context.previousMoveToEntries
//         );
//         queryClient.setQueryData(
//           [TEMP_ROOT_NAME, parentId],
//           context.previousEntries
//         );
//       }
//     },
//     onSuccess: () => {
//       toast.success("Entry moved successfully");
//     },
//     // onSettled: (_data, _error, { queryPath }) => {
//     //   queryClient.invalidateQueries({ queryKey: queryPath });
//     // },
//   });
// };

// export default useMoveEntry;

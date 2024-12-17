import { Separator } from "@/components/ui/separator";
import EntryInput from "../../EntryInput";
import EntryFolder from "../EntryFolder";
import EntryLink from "../EntryLink";
import useGetEntries from "../../../hooks/useGetFolderEntries";
import FolderContentLoading from "./FolderContent.loading";
import FolderContentError from "./FolderContent.error";
import { useEffect } from "react";
import { QueryPath } from "@/features/fileExplorer/entryTypes";
import { useEntryStore } from "@/features/fileExplorer/store/EntryStoreProvider";

type Props = {
  queryPath: QueryPath;
  embedLevel: number;
  isAddingEntry: boolean;
};

const FolderContent = ({ queryPath, embedLevel, isAddingEntry }: Props) => {
  const { data: entries, isError, isPending } = useGetEntries(queryPath);

  const inputType = useEntryStore(
    (store) => store.modifyEntry.add.inputEntryType
  );

  const updateFolderHierarchy = useEntryStore(
    (state) => state.folders.actions.updateFolderHierarchy
  );

  useEffect(() => {
    if (entries) {
      const folderData = entries
        .filter((entry) => entry.isFolder)
        .map((entry) => ({
          id: entry.id,
          parentId: entry.parentId ?? null,
        }));

      updateFolderHierarchy(folderData);
    }
  }, [entries, updateFolderHierarchy]);

  if (isPending) return <FolderContentLoading />;
  if (isError) return <FolderContentError />;
  if (!!!entries.length && !isAddingEntry) return null;
  return (
    <div className="grid">
      <div className="flex overflow-clip row-span-2 pr-2">
        <Separator orientation="vertical" className="ml-4 my-2 w-0.5" />
        <ul className="flex flex-col pl-2 w-full py-1 gap-0.5">
          {isAddingEntry && (
            <EntryInput
              inputType={inputType}
              embedLevel={embedLevel + 1}
              mode="add"
              queryPath={queryPath}
            />
          )}
          {entries.map((entry) =>
            entry.isFolder ? (
              <EntryFolder
                key={entry.id}
                embedLevel={embedLevel + 1}
                title={entry.title}
                queryPath={[...queryPath, entry.id]}
              />
            ) : (
              <EntryLink
                key={entry.id}
                embedLevel={embedLevel + 1}
                title={entry.title}
                queryPath={[...queryPath, entry.id]}
              />
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default FolderContent;

// import { Separator } from "@/components/ui/separator";
// import EntryInput from "../../EntryInput";
// import EntryFolder from "../EntryFolder";
// import EntryLink from "../EntryLink";
// import useGetEntries from "../../../hooks/useGetEntries";
// import { QueryPath } from "../../../entryTypes";
// import FolderContentLoading from "./FolderContent.loading";
// import FolderContentError from "./FolderContent.error";
// import useEntryStore from "@/features/entries/store/useEntryStore";
// import { useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";

// type Props = {
//   queryPath: QueryPath;
//   embedLevel: number;
//   isAddingEntry: boolean;
// };

// const FolderContent = ({ queryPath, embedLevel, isAddingEntry }: Props) => {
//   const { data: entries, isError, isPending } = useGetEntries(queryPath);

//   const updateFolderHierarchy = useEntryStore(
//     (state) => state.folders.actions.updateFolderHierarchy
//   );

//   useEffect(() => {
//     if (entries) {
//       const folderData = entries
//         .filter((entry) => entry.isFolder)
//         .map((entry) => ({
//           id: entry.id,
//           parentId: entry.parentId ?? null,
//         }));

//       updateFolderHierarchy(folderData);
//     }
//   }, [entries, updateFolderHierarchy]);

//   if (isPending) return <FolderContentLoading />;
//   if (isError) return <FolderContentError />;
//   if (!!!entries.length && !isAddingEntry) return null;
//   return (
//     <motion.div
//       initial={{ gridTemplateRows: "0fr" }}
//       animate={{ gridTemplateRows: "1fr" }}
//       exit={{ gridTemplateRows: "0fr" }}
//       transition={{
//         type: "spring",
//         ease: "easeInOut",
//         gridTemplateRows: { duration: 0.3 },
//       }}
//       className="grid"
//     >
//       <div className="flex overflow-clip row-span-2 pr-2">
//         <Separator orientation="vertical" className="ml-4 my-2 w-0.5" />
//         <motion.ul
//           initial={{ opacity: 0, x: 24 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: 24, transition: { delay: 0 } }}
//           transition={{
//             type: "spring",
//             bounce: 0.5,
//             duration: 0.5,
//             delay: 0.1,
//           }}
//           className="flex flex-col pl-2 w-full py-1 gap-0.5"
//         >
//           <AnimatePresence>
//             {isAddingEntry && (
//               <EntryInput
//                 embedLevel={embedLevel + 1}
//                 mode="add"
//                 queryPath={queryPath}
//               />
//             )}
//           </AnimatePresence>
//           {entries.map((entry) =>
//             entry.isFolder ? (
//               <EntryFolder
//                 key={entry.id}
//                 embedLevel={embedLevel + 1}
//                 title={entry.title}
//                 queryPath={[...queryPath, entry.id]}
//               />
//             ) : (
//               <EntryLink
//                 key={entry.id}
//                 embedLevel={embedLevel + 1}
//                 title={entry.title}
//                 queryPath={[...queryPath, entry.id]}
//               />
//             )
//           )}
//         </motion.ul>
//       </div>
//     </motion.div>
//   );
// };

// export default FolderContent;

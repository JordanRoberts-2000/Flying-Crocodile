import { Separator } from "@/components/ui/separator";
import EntryInput from "../../EntryInput";
import EntryFolder from "../EntryFolder";
import EntryLink from "../EntryLink";
import useGetEntries from "../../../hooks/useGetEntries";
import { QueryPath } from "../../../entryTypes";
import FolderContentLoading from "./FolderContent.loading";
import FolderContentError from "./FolderContent.error";
import useEntryStore from "@/features/entries/store/useEntryStore";
import { useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  queryPath: QueryPath;
  embedLevel: number;
  isAddingEntry: boolean;
};

const FolderContent = ({ queryPath, embedLevel, isAddingEntry }: Props) => {
  const { data: entries, isError, isPending } = useGetEntries(queryPath);

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
    <motion.div
      initial={{ gridTemplateRows: "0fr" }}
      animate={{ gridTemplateRows: "1fr" }}
      exit={{ gridTemplateRows: "0fr" }}
      transition={{
        type: "spring",
        ease: "easeInOut",
        gridTemplateRows: { duration: 0.3 },
      }}
      className="grid py-1 pr-2"
    >
      <div className="flex overflow-hidden row-span-2">
        <Separator orientation="vertical" className="ml-4" />
        <motion.ul
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16, transition: { delay: 0 } }}
          transition={{
            type: "spring",
            bounce: 0.5,
            duration: 0.3,
            delay: 0.15,
          }}
          className="flex flex-col pl-2 w-full gap-0.5"
        >
          {isAddingEntry && (
            <li>
              <EntryInput
                embedLevel={embedLevel + 1}
                mode="add"
                queryPath={queryPath}
              />
            </li>
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
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default FolderContent;

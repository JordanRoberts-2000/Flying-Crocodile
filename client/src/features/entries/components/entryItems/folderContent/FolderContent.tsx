import { Separator } from "@/components/ui/separator";
import EntryInput from "../../EntryInput";
import EntryFolder from "../EntryFolder";
import EntryLink from "../EntryLink";
import useGetEntries from "../../../hooks/useGetEntries";
import { QueryPath } from "../../../entryTypes";
import FolderContentLoading from "./FolderContent.loading";
import FolderContentError from "./FolderContent.error";
import getEntryId from "@/features/entries/utils/getId";
import useEntryStore from "@/features/entries/store/useEntryStore";
import { useEffect } from "react";

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
    <div
      className="flex py-1 pr-2"
      style={{ viewTransitionName: `entry-content-${getEntryId(queryPath)}` }}
    >
      <Separator orientation="vertical" className="ml-4" />
      <ul className="flex flex-col pl-2 w-full gap-0.5">
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
      </ul>
    </div>
  );
};

export default FolderContent;

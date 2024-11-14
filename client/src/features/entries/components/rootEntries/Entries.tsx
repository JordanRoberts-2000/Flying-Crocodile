import { useEffect, useRef } from "react";
import AddEntityPopover from "../popovers/AddEntityPopover";
import EntryInput from "../EntryInput";
import { Separator } from "@/components/ui/separator";
import useGetRootEntries from "../../hooks/useGetRootEntry";
import EntriesLoading from "./Entries.loading";
import EntriesError from "./Entries.error";
import EntriesEmpty from "./Entries.empty";
import Icon from "@/components/Icon";
import EntryFolder from "../entryItems/EntryFolder";
import EntryLink from "../entryItems/EntryLink";
import EditEntityPopover from "../popovers/EditEntryPopover";
import clsx from "clsx";
import useEntryStore from "../../store/useEntryStore";
import useEntryInteractions from "../../hooks/useEntryInteractions";
import EntryDragCover from "../EntryDragCover";
import { QueryPath } from "../../entryTypes";

const Entries = () => {
  const addPopoverAnchorRef = useRef<HTMLButtonElement | null>(null);

  const { rootId, entries, isError, isPending } = useGetRootEntries("gallery");

  const inputType = useEntryStore(
    (state) => state.modifyEntry.add.inputEntryType
  );

  const triggerPopover = useEntryStore(
    (state) => state.modifyEntry.actions.triggerPopover
  );
  const isAddingEntry = useEntryStore(
    (state) =>
      state.modifyEntry.id.entryId === rootId &&
      state.modifyEntry.add.inputActive
  );
  const addPopoverOpen = useEntryStore(
    (state) =>
      state.modifyEntry.add.popoverOpen &&
      state.modifyEntry.id.entryId === rootId
  );

  const draggingOver = useEntryStore(
    (state) => state.dragging.entryId === rootId
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

  const rootHandlers = useEntryInteractions();

  if (isPending) return <EntriesLoading />;
  if (isError) return <EntriesError />;

  const queryPath = ["entries", rootId] as QueryPath;
  return (
    <div {...rootHandlers} className="flex-1 flex-col flex min-h-0 relative">
      <EntryDragCover />
      <AddEntityPopover rootId={rootId} />
      <EditEntityPopover />
      <button
        ref={addPopoverAnchorRef}
        onClick={() => triggerPopover(queryPath, "add", addPopoverAnchorRef)}
        className={clsx(
          addPopoverOpen && "text-blue-500",
          "w-fit hover:text-blue-500 pt-3 pl-3"
        )}
      >
        <Icon name="plus" strokeWidth={2} />
      </button>

      <div
        data-querypath={JSON.stringify(queryPath)}
        className={clsx(
          "dropEntry px-2 pl-4 flex-1 flex flex-col overflow-y-auto py-1",
          draggingOver && "bg-lime-300"
        )}
      >
        {!!!entries.length && !isAddingEntry ? (
          <EntriesEmpty />
        ) : (
          <ul className="flex flex-col flex-1 gap-0.5">
            {isAddingEntry && (
              <li>
                <EntryInput
                  embedLevel={1}
                  inputType={inputType}
                  mode="add"
                  queryPath={queryPath}
                />
              </li>
            )}

            {entries.map((entry) =>
              entry.isFolder ? (
                <EntryFolder
                  key={entry.id}
                  embedLevel={1}
                  title={entry.title}
                  queryPath={[...queryPath, entry.id]}
                />
              ) : (
                <EntryLink
                  key={entry.id}
                  embedLevel={1}
                  title={entry.title}
                  queryPath={[...queryPath, entry.id]}
                />
              )
            )}
          </ul>
        )}
        <Separator />
      </div>
    </div>
  );
};

export default Entries;

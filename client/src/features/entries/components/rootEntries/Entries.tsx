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

const TEMP_ROOT_NAME = "gallery";

const Entries = () => {
  const addPopoverAnchorRef = useRef<HTMLButtonElement | null>(null);

  const { rootId, entries, isError, isPending } =
    useGetRootEntries(TEMP_ROOT_NAME);

  const inputType = useEntryStore(
    (store) => store.modifyEntry.add.inputEntryType
  );

  const triggerPopover = useEntryStore(
    (state) => state.modifyEntry.actions.triggerPopover
  );
  const isAddingEntry = useEntryStore(
    (store) =>
      store.modifyEntry.add.entryId === rootId &&
      store.modifyEntry.add.inputActive
  );
  const addPopoverOpen = useEntryStore(
    (state) =>
      state.modifyEntry.add.popoverOpen &&
      state.modifyEntry.add.entryId === rootId
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

  return (
    <div {...rootHandlers} className="flex-1 flex-col flex min-h-0">
      <AddEntityPopover rootId={rootId} />
      <EditEntityPopover />
      <button
        ref={addPopoverAnchorRef}
        onClick={() => triggerPopover(rootId, "add", addPopoverAnchorRef)}
        className={clsx(
          addPopoverOpen && "text-blue-500",
          "w-fit hover:text-blue-500 pt-3 pl-3"
        )}
      >
        <Icon name="plus" strokeWidth={2} />
      </button>

      <div className="px-2 pl-4 flex-1 flex flex-col overflow-y-auto py-1">
        {!!!entries.length ? (
          <EntriesEmpty />
        ) : (
          <ul className="flex flex-col flex-1 gap-0.5">
            {isAddingEntry && (
              <li>
                <EntryInput
                  embedLevel={1}
                  inputType={inputType}
                  mode="add"
                  queryPath={[TEMP_ROOT_NAME, rootId]}
                />
              </li>
            )}

            {entries.map((entry) =>
              entry.isFolder ? (
                <EntryFolder
                  key={entry.id}
                  embedLevel={1}
                  title={entry.title}
                  queryPath={[TEMP_ROOT_NAME, rootId, entry.id]}
                />
              ) : (
                <EntryLink
                  key={entry.id}
                  embedLevel={1}
                  title={entry.title}
                  queryPath={[TEMP_ROOT_NAME, rootId, entry.id]}
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

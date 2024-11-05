import { useRef } from "react";
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
import getEntryId from "../../utils/getId";
import clsx from "clsx";
import useEntryStore from "../../store/useEntryStore";

const TEMP_ROOT_NAME = "gallery";

const Entries = () => {
  const addPopoverAnchorRef = useRef<HTMLButtonElement | null>(null);

  const { rootId, entries, isError, isPending } =
    useGetRootEntries(TEMP_ROOT_NAME);

  const triggerPopover = useEntryStore(
    (state) => state.modifyEntry.actions.triggerPopover
  );
  const isAddingEntry = useEntryStore(
    (store) =>
      !!store.modifyEntry.queryPath &&
      getEntryId(store.modifyEntry.queryPath) === rootId &&
      store.modifyEntry.add.inputActive
  );
  const addPopoverOpen = useEntryStore(
    (state) =>
      !!state.modifyEntry.add.popoverOpen &&
      state.modifyEntry.queryPath &&
      getEntryId(state.modifyEntry.queryPath) === rootId
  );

  if (isPending) return <EntriesLoading />;
  if (isError) return <EntriesError />;

  return (
    <>
      <AddEntityPopover rootId={rootId} />
      <EditEntityPopover />

      <button
        ref={addPopoverAnchorRef}
        onClick={() =>
          triggerPopover([TEMP_ROOT_NAME, rootId], "add", addPopoverAnchorRef)
        }
        className={clsx(addPopoverOpen && "text-blue-500", "w-fit p-3")}
      >
        <Icon name="plus" strokeWidth={2} />
      </button>

      <div className="px-2 pl-4 flex-1 flex flex-col overflow-y-auto">
        {!!!entries.length ? (
          <EntriesEmpty />
        ) : (
          <ul className="flex flex-col flex-1 gap-0.5">
            {isAddingEntry && (
              <li>
                <EntryInput
                  embedLevel={1}
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
    </>
  );
};

export default Entries;

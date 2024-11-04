import { useState } from "react";
import AddEntityPopover from "../popovers/AddEntityPopover";
import EntryInput from "../EntryInput";
import { Separator } from "@/components/ui/separator";
import useGetRootEntries from "../../hooks/useGetRootEntry";
import { AddingEntry } from "../../entryTypes";
import EntriesLoading from "./Entries.loading";
import EntriesError from "./Entries.error";
import EntriesEmpty from "./Entries.empty";
import Icon from "@/components/Icon";
import EntryFolder from "../entryItems/EntryFolder";
import EntryLink from "../entryItems/EntryLink";
import clsx from "clsx";

const TEMP_ROOT_NAME = "gallery";

const Entries = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [addingEntry, setAddingEntry] = useState<AddingEntry>(false);

  const { rootId, entries, isError, isPending } =
    useGetRootEntries(TEMP_ROOT_NAME);

  if (isPending) return <EntriesLoading />;
  if (isError) return <EntriesError />;

  return (
    <>
      <AddEntityPopover
        open={popoverOpen}
        isRoot={true}
        onOpenChange={setPopoverOpen}
        embedLevel={1}
        folderId={rootId}
        setAddingEntry={setAddingEntry}
        className={clsx(
          popoverOpen && "text-blue-600",
          "p-3 hover:text-blue-600 w-fit"
        )}
      >
        <Icon name="plus" strokeWidth={2} />
      </AddEntityPopover>

      <div className="px-2 pl-4 flex-1 flex flex-col overflow-y-auto">
        {!!!entries.length ? (
          <EntriesEmpty />
        ) : (
          <ul className="flex flex-col flex-1 gap-0.5">
            {addingEntry && (
              <li>
                <EntryInput
                  embedLevel={1}
                  setAddingEntry={setAddingEntry}
                  addingEntry={addingEntry}
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

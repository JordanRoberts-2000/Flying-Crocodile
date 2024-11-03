import { useState } from "react";
import AddEntityPopover from "./popovers/AddEntityPopover";
import EntryInput from "./EntryInput";
import EntryFolder from "./EntryFolder";
import EntryLink from "./EntryLink";
import { Separator } from "@/components/ui/separator";
import useGetRootEntries from "../hooks/useGetRootEntry";
import { AddingEntry } from "../entryTypes";
import PlusIcon from "../../../assets/svgs/add.svg?react";
import useGetEntries from "../hooks/useGetEntries";

const Entries = ({}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data: rootId, isLoading, error } = useGetRootEntries("gallery");
  const { data: entries } = useGetEntries(["gallery", rootId]);
  const [addingEntry, setAddingEntry] = useState<AddingEntry>(false);

  if (isLoading)
    return (
      <div className="flex-1 bg-gray-50 animate-pulse flex items-center justify-center">
        <div className="size-10 border-l-0 border-2 rounded-full border-gray-700 animate-spin" />
      </div>
    );
  if (error) return <div>Error Tap to retry</div>;
  if (!entries) return;
  return (
    <div className="px-2 pl-4 flex-1 flex flex-col">
      <AddEntityPopover
        open={popoverOpen}
        isRoot={true}
        onOpenChange={setPopoverOpen}
        embedLevel={1}
        folderId={rootId!}
        setAddingEntry={setAddingEntry}
        className="pt-2 pb-1 hover:text-blue-600 w-fit"
      >
        <PlusIcon className="size-5 min-w-5" strokeWidth={2} />
      </AddEntityPopover>
      <ul className="flex flex-col flex-1 gap-0.5">
        {addingEntry && (
          <EntryInput
            embedLevel={1}
            setAddingEntry={setAddingEntry}
            addingEntry={addingEntry}
            mode="add"
            queryPath={["gallery", rootId]}
          />
        )}
        {entries.map((entry) =>
          entry.isFolder ? (
            <EntryFolder
              key={entry.id}
              embedLevel={1}
              title={entry.title}
              queryPath={["gallery", rootId, entry.id]}
            />
          ) : (
            <EntryLink
              key={entry.id}
              embedLevel={1}
              title={entry.title}
              queryPath={["gallery", rootId, entry.id]}
            />
          )
        )}
      </ul>
      <Separator />
    </div>
  );
};

export default Entries;

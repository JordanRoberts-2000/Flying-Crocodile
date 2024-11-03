import { useState } from "react";
import AddEntityPopover from "./popovers/AddEntityPopover";
import EntryInput from "./EntryInput";
import EntryFolder from "./EntryFolder";
import EntryLink from "./EntryLink";
import { Separator } from "@/components/ui/separator";
import useGetRootEntries from "../hooks/useGetRootEntry";
import { AddingEntry } from "../entryTypes";
import PlusIcon from "../../../assets/svgs/add.svg?react";

const Entries = ({}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data, isLoading, isSuccess } = useGetRootEntries("gallery");
  const [addingEntry, setAddingEntry] = useState<AddingEntry>(false);
  const rootId = data?.rootId ?? 1;
  if (isLoading || !isSuccess) return;
  return (
    <div className="px-2 pl-4 flex-1 flex flex-col">
      <AddEntityPopover
        open={popoverOpen}
        isRoot={true}
        onOpenChange={setPopoverOpen}
        embedLevel={1}
        folderId={rootId}
        setAddingEntry={setAddingEntry}
        className="pt-2 pb-1 hover:text-blue-600 w-fit"
      >
        <PlusIcon className="size-5 min-w-5" strokeWidth={2} />
      </AddEntityPopover>
      <ul className="flex flex-col flex-1 gap-0.5">
        {addingEntry && (
          <EntryInput
            setAddingEntry={setAddingEntry}
            addingEntry={addingEntry}
            mode="add"
            mutateId={rootId}
          />
        )}
        {data.entries.map((entry) =>
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

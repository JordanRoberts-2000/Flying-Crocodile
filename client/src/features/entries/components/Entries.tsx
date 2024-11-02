import { useState } from "react";
import useGetEntries from "../hooks/useGetEntries";
import useEntryStore from "../store";
import AddEntityPopover from "./AddEntityPopover";
import EntryInput from "./EntryInput";
import EntryFolder from "./EntryFolder";
import EntryLink from "./EntryLink";
import { Separator } from "@/components/ui/separator";
import useInputIdMatch from "../hooks/useInputIdMatch";

const TEMP_ROOT_ID = 1;

const Entries = ({}) => {
  const isMatchingId = useInputIdMatch(TEMP_ROOT_ID, "add");
  const editMode = useEntryStore((state) => state.editMode);
  const { data: entries, isLoading, isSuccess } = useGetEntries();
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (isLoading || !isSuccess) return;
  return (
    <div className="px-2 flex-1 flex flex-col">
      {(editMode || !entries.length) && (
        <AddEntityPopover
          folderId={TEMP_ROOT_ID}
          onOpenChange={setPopoverOpen}
          open={popoverOpen}
        >
          <button className="border border-gray-200 py-2 mt-4 rounded-md w-full">
            Add entry
          </button>
        </AddEntityPopover>
      )}
      <ul className="flex flex-col flex-1 pt-4 gap-0.5">
        {isMatchingId && <EntryInput entryId={TEMP_ROOT_ID} />}
        {entries.map((entry) =>
          entry.isFolder ? (
            <EntryFolder
              key={entry.id}
              id={entry.id}
              embedLevel={1}
              title={entry.title}
            />
          ) : (
            <EntryLink
              key={entry.id}
              embedLevel={1}
              title={entry.title}
              id={entry.id}
            />
          )
        )}
      </ul>
      <Separator />
    </div>
  );
};

export default Entries;

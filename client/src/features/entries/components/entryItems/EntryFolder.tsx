import { useRef, useState } from "react";
import AddEntityPopover from "../popovers/AddEntityPopover";
import EntryInput from "../EntryInput";
import useGetEntries from "../../hooks/useGetEntries";
import { Separator } from "@/components/ui/separator";
import EntryLink from "./EntryLink";
import EditEntityPopover from "../popovers/EditEntryPopover";
import { AddingEntry, QueryPath } from "../../entryTypes";
import { HOLD_TO_TRIGGER_MS } from "@/constants";
import getEntryId from "../../utils/getId";
import useErrorNotification from "../../hooks/useErrorNotification";
import Icon from "@/components/Icon";

type Props = {
  title: string;
  embedLevel: number;
  queryPath: QueryPath;
};

const EntryFolder = ({ title, embedLevel, queryPath }: Props) => {
  const [addPopoverOpen, setAddPopoverOpen] = useState(false);
  const [editPopoverOpen, setEditPopoverOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [editingActive, setEditingActive] = useState(false);
  const [addingEntry, setAddingEntry] = useState<AddingEntry>(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const { data: entries, isError, isPending } = useGetEntries(queryPath);
  useErrorNotification(
    isError,
    `Error getting entries from id: "${[queryPath]}"`
  );

  const entryId = getEntryId(queryPath);
  const isOptimisticEntry = entryId === -1;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      isLongPress.current = false;
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        setEditPopoverOpen(true);
      }, HOLD_TO_TRIGGER_MS);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (e.button === 0 && !isLongPress.current) {
      setFolderOpen((prev) => !prev);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditPopoverOpen(true);
  };

  if (isPending || isError) return;
  return (
    <li
      className={`${
        isOptimisticEntry && "pointer-events-none hover:opacity-15"
      } flex flex-col`}
    >
      <EditEntityPopover
        queryPath={queryPath}
        isFolder={true}
        open={editPopoverOpen}
        onOpenChange={setEditPopoverOpen}
        setEditingActive={setEditingActive}
      >
        <div
          onContextMenu={handleContextMenu}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`flex ${
            embedLevel >= 2 ? "py-1" : "py-2"
          } px-2 rounded-md cursor-pointer items-center hover:bg-gray-50 transition-colors ${
            folderOpen && "bg-gray-50"
          } ${
            (addPopoverOpen || editPopoverOpen) &&
            "outline outline-2 outline-blue-300"
          }`}
        >
          <div
            className={`${embedLevel >= 2 ? "p-1.5" : "p-2"} ${
              folderOpen ? "shadow-blue-300 shadow-sm" : "shadow"
            } border-gray-100 border rounded-lg relative group`}
          >
            <AddEntityPopover
              setFolderOpen={setFolderOpen}
              embedLevel={embedLevel + 1}
              folderId={entryId}
              open={addPopoverOpen}
              onOpenChange={setAddPopoverOpen}
              setAddingEntry={setAddingEntry}
              className={` ${
                addPopoverOpen ? "scale-100" : "scale-0"
              } group-hover:scale-100 transition-transform absolute z-50 inset-0 size-full p-1 flex items-center justify-center`}
            >
              <Icon name="plus" className="size-4" />
            </AddEntityPopover>
            <Icon
              name="folder"
              className={`${embedLevel >= 2 ? "size-3" : "size-4"} ${
                addPopoverOpen ? "scale-0" : "scale-100"
              } group-hover:scale-0 transition-transform`}
            />
          </div>

          {editingActive ? (
            <EntryInput
              embedLevel={embedLevel}
              defaultValue={title}
              mode="edit"
              queryPath={queryPath}
              addingEntry="folder"
              setEditingActive={setEditingActive}
            />
          ) : (
            <p
              className={`${embedLevel >= 2 && "text-sm"} ${
                folderOpen ? "text-blue-400" : "text-neutral-600"
              } font-semibold select-none text-sm ml-4 font-sans whitespace-nowrap overflow-hidden text-ellipsis`}
            >
              {title}
            </p>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Icon
              name="arrow"
              className={`size-6 transition-transform duration-300 ${
                folderOpen && "rotate-90"
              }`}
            />
          </div>
        </div>
      </EditEntityPopover>
      {folderOpen && isError && <div>Error Tap to retry</div>}
      {folderOpen && isPending && (
        <div className="w-full p-3 bg-gray-50 animate-pulse flex items-center justify-center">
          <div className="size-6 border-l-0 border-2 rounded-full border-gray-700 animate-spin" />
        </div>
      )}
      {folderOpen &&
        !isPending &&
        !isError &&
        (!!entries.length || addingEntry) && (
          <div className="flex py-1 pr-2">
            <Separator orientation="vertical" className="ml-2" />
            <ul className="flex flex-col pl-4 w-full gap-0.5">
              {addingEntry && (
                <li>
                  <EntryInput
                    embedLevel={embedLevel + 1}
                    addingEntry={addingEntry}
                    mode="add"
                    queryPath={queryPath}
                    setAddingEntry={setAddingEntry}
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
        )}
    </li>
  );
};

export default EntryFolder;

import { useState } from "react";
import clsx from "clsx";
import AddEntityPopover from "../popovers/AddEntityPopover";
import EntryInput from "../EntryInput";
import { AddingEntry, QueryPath } from "../../entryTypes";
import getEntryId from "../../utils/getId";
import Icon from "@/components/Icon";
import useLongPress from "@/hooks/useLongPress";
import FolderContent from "./folderContent/FolderContent";
import EditEntityPopover from "../popovers/EditEntryPopover";
import viewTransition from "@/utils/viewTransition";

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

  const { registerMouseDown, registerMouseUp, isLongPress } = useLongPress(() =>
    setEditPopoverOpen(true)
  );

  const entryId = getEntryId(queryPath);
  const isOptimisticEntry = entryId === -1;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditPopoverOpen(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    console.log("triggered");
    registerMouseUp();
    if (!isLongPress.current) {
      viewTransition(() => setFolderOpen((prev) => !prev));
    }
  };

  return (
    <li
      // style={{
      //   ...(embedLevel < 2 ? { viewTransitionName: `entry-${entryId}` } : {}),
      // }}
      className={clsx(
        "flex flex-col",
        isOptimisticEntry && "pointer-events-none hover:opacity-15"
      )}
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
          onMouseDown={registerMouseDown}
          onMouseUp={(e) => handleMouseUp(e)}
          className={clsx(
            "flex px-2 rounded-md cursor-pointer items-center hover:bg-gray-50 transition-colors",
            embedLevel >= 2 ? "py-1" : "py-2",
            folderOpen && "bg-gray-50",
            (addPopoverOpen || editPopoverOpen) &&
              "outline outline-2 outline-blue-300"
          )}
        >
          <div
            className={clsx(
              "outline-gray-100 outline outline-1 rounded-lg relative group",
              embedLevel >= 2 ? "p-1.5" : "p-2",
              folderOpen ? "shadow-blue-300 shadow-sm" : "shadow"
            )}
          >
            <AddEntityPopover
              setFolderOpen={setFolderOpen}
              embedLevel={embedLevel + 1}
              folderId={entryId}
              open={addPopoverOpen}
              onOpenChange={setAddPopoverOpen}
              setAddingEntry={setAddingEntry}
              className={clsx(
                "group-hover:scale-100 transition-transform absolute z-50 inset-0 size-full p-1 flex items-center justify-center",
                addPopoverOpen ? "scale-100" : "scale-0"
              )}
            >
              <Icon name="plus" className="size-4" />
            </AddEntityPopover>
            <Icon
              name="folder"
              className={clsx(
                embedLevel >= 2 ? "size-4" : "size-5",
                addPopoverOpen ? "scale-0" : "scale-100",
                "group-hover:scale-0 transition-transform"
              )}
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
              className={clsx(
                "font-semibold select-none text-sm ml-4 font-sans whitespace-nowrap overflow-hidden text-ellipsis",
                embedLevel >= 2 && "text-sm",
                folderOpen ? "text-blue-400" : "text-neutral-600"
              )}
            >
              {title}
            </p>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Icon
              name="arrow"
              className={clsx(
                "size-6 transition-transform duration-300",
                folderOpen && "rotate-90"
              )}
            />
          </div>
        </div>
      </EditEntityPopover>
      {folderOpen && (
        <FolderContent
          queryPath={queryPath}
          embedLevel={embedLevel}
          addingEntry={addingEntry}
          setAddingEntry={setAddingEntry}
        />
      )}
    </li>
  );
};

export default EntryFolder;

import { useRef } from "react";
import clsx from "clsx";
import EntryInput from "../EntryInput";
import { QueryPath } from "../../entryTypes";
import getEntryId from "../../utils/getId";
import Icon from "@/components/Icon";
import useLongPress from "@/hooks/useLongPress";
import FolderContent from "./folderContent/FolderContent";
import useEntryStore from "../../store/useEntryStore";
import { AnimatePresence } from "framer-motion";

type Props = {
  title: string;
  embedLevel: number;
  queryPath: QueryPath;
};

const EntryFolder = ({ title, embedLevel, queryPath }: Props) => {
  const folderId = getEntryId(queryPath);
  const isOptimisticEntry = folderId === -1;

  const folderOpen = useEntryStore((state) =>
    state.folders.openFolders.has(folderId)
  );
  const setFolderOpen = useEntryStore(
    (state) => state.folders.actions.setFolderOpen
  );

  const addAnchorRef = useRef<HTMLDivElement | null>(null);
  const editAnchorRef = useRef<HTMLDivElement | null>(null);

  const triggerPopover = useEntryStore(
    (state) => state.modifyEntry.actions.triggerPopover
  );
  const setInputType = useEntryStore(
    (state) => state.modifyEntry.actions.setInputType
  );
  const editPopoverOpen = useEntryStore(
    (state) =>
      !!state.modifyEntry.edit.popoverOpen &&
      state.modifyEntry.queryPath &&
      getEntryId(state.modifyEntry.queryPath) === folderId
  );
  const addPopoverOpen = useEntryStore(
    (state) =>
      !!state.modifyEntry.add.popoverOpen &&
      state.modifyEntry.queryPath &&
      getEntryId(state.modifyEntry.queryPath) === folderId
  );
  const isAddingEntry = useEntryStore(
    (store) =>
      !!store.modifyEntry.queryPath &&
      getEntryId(store.modifyEntry.queryPath) === folderId &&
      store.modifyEntry.add.inputActive
  );
  const isEditingEntry = useEntryStore(
    (store) =>
      !!store.modifyEntry.queryPath &&
      getEntryId(store.modifyEntry.queryPath) === folderId &&
      store.modifyEntry.edit.inputActive
  );

  const { registerMouseDown, registerMouseUp, isLongPress } = useLongPress(
    () => {
      setInputType("folder");
      triggerPopover(queryPath, "edit", editAnchorRef);
    }
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setInputType("folder");
    triggerPopover(queryPath, "edit", editAnchorRef);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    registerMouseUp();
    if (!isLongPress.current) {
      setFolderOpen(folderId, (prev) => !prev);
    }
  };

  return (
    <li
      className={clsx(
        "flex flex-col",
        isOptimisticEntry && "pointer-events-none hover:opacity-15"
      )}
    >
      <div
        ref={editAnchorRef}
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
          ref={addAnchorRef}
          className={clsx(
            "outline-gray-100 outline outline-1 rounded-lg relative group",
            embedLevel >= 2 ? "p-1.5" : "p-2",
            folderOpen ? "shadow-blue-300 shadow-sm" : "shadow"
          )}
        >
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={() => triggerPopover(queryPath, "add", addAnchorRef)}
            className={clsx(
              addPopoverOpen ? "scale-100" : "scale-0",
              "group-hover:scale-100 transition-transform absolute z-50 inset-0 size-full p-1 flex items-center justify-center"
            )}
          >
            <Icon name="plus" className="size-4" />
          </button>
          <Icon
            name="folder"
            className={clsx(
              embedLevel >= 2 ? "size-4" : "size-5",
              addPopoverOpen ? "scale-0" : "scale-100",
              "group-hover:scale-0 transition-transform"
            )}
          />
        </div>

        {isEditingEntry ? (
          <EntryInput
            embedLevel={embedLevel}
            defaultValue={title}
            mode="edit"
            queryPath={queryPath}
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
      <AnimatePresence>
        {folderOpen && (
          <FolderContent
            queryPath={queryPath}
            embedLevel={embedLevel}
            isAddingEntry={isAddingEntry}
          />
        )}
      </AnimatePresence>
    </li>
  );
};

export default EntryFolder;

import ImageIcon from "../../../assets/svgs/photo.svg?react";
import EntryInput from "./EntryInput";
import { useRef, useState } from "react";
import EditEntityPopover from "./popovers/EditEntryPopover";
import { HOLD_TO_TRIGGER_MS } from "@/constants";
import { QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";

type Props = {
  queryPath: QueryPath;
  title: string;
  embedLevel: number;
};

const EntryLink = ({ queryPath, title, embedLevel }: Props) => {
  const [editPopoverOpen, setEditPopoverOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const [editingActive, setEditingActive] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      isLongPress.current = false;
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        setEditPopoverOpen(true);
      }, HOLD_TO_TRIGGER_MS);
    }
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditPopoverOpen(true);
  };

  return (
    <EditEntityPopover
      queryPath={queryPath}
      isFolder={false}
      open={editPopoverOpen}
      onOpenChange={setEditPopoverOpen}
      setEditingActive={setEditingActive}
    >
      <li
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="flex items-center py-2 px-2 hover:bg-gray-50 transition-colors rounded-md"
      >
        <div className={`${embedLevel >= 2 ? " p-1" : " p-1.5"}`}>
          <ImageIcon
            strokeWidth={2}
            className={`${
              embedLevel >= 2 ? "size-5 min-w-5" : "size-6 min-w-6"
            }`}
          />
        </div>
        {editingActive ? (
          <EntryInput
            defaultValue={title}
            mode="edit"
            addingEntry="link"
            mutateId={getEntryId(queryPath)}
            setEditingActive={setEditingActive}
          />
        ) : (
          <p
            className={`${
              embedLevel >= 2 && ""
            } font-semibold ml-4 text-sm font-sans text-neutral-600 whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            {title}
          </p>
        )}
      </li>
    </EditEntityPopover>
  );
};

export default EntryLink;

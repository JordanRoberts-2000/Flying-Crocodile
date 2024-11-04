import EntryInput from "../EntryInput";
import { useState } from "react";
import clsx from "clsx";
import { QueryPath } from "../../entryTypes";
import getEntryId from "../../utils/getId";
import Icon from "@/components/Icon";
import useLongPress from "@/hooks/useLongPress";
import EditEntityPopover from "../popovers/EditEntryPopover";

type Props = {
  queryPath: QueryPath;
  title: string;
  embedLevel: number;
};

const EntryLink = ({ queryPath, title, embedLevel }: Props) => {
  const [editPopoverOpen, setEditPopoverOpen] = useState(false);
  const [editingActive, setEditingActive] = useState(false);

  const { registerMouseDown, registerMouseUp } = useLongPress(() =>
    setEditPopoverOpen(true)
  );

  const entryId = getEntryId(queryPath);
  const isOptimisticEntry = entryId === -1;

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
        onMouseDown={registerMouseDown}
        onMouseUp={registerMouseUp}
        style={{
          ...(embedLevel < 2 ? { viewTransitionName: `entry-${entryId}` } : {}),
        }}
        className={clsx(
          "flex items-center px-2 hover:bg-gray-50 transition-colors rounded-md cursor-pointer",
          isOptimisticEntry && "hover:opacity-15 pointer-events-none",
          embedLevel >= 2 ? "py-1" : "py-2",
          editPopoverOpen && "outline outline-2 outline-blue-300"
        )}
      >
        <div className={clsx(embedLevel >= 2 ? "p-1" : "p-1.5")}>
          <Icon
            name="photo"
            strokeWidth={2}
            className={clsx(embedLevel >= 2 ? "size-5" : "size-6")}
          />
        </div>
        {editingActive ? (
          <EntryInput
            embedLevel={embedLevel}
            defaultValue={title}
            mode="edit"
            addingEntry="link"
            queryPath={queryPath}
            setEditingActive={setEditingActive}
          />
        ) : (
          <p
            className={clsx(
              "font-semibold select-none ml-4 text-sm font-sans text-neutral-600 whitespace-nowrap overflow-hidden text-ellipsis",
              embedLevel >= 2 && "text-sm"
            )}
          >
            {title}
          </p>
        )}
      </li>
    </EditEntityPopover>
  );
};

export default EntryLink;

import EntryInput from "../EntryInput";
import { useRef } from "react";
import clsx from "clsx";
import { QueryPath } from "../../entryTypes";
import getEntryId from "../../utils/getId";
import Icon from "@/components/Icon";
import useLongPress from "@/hooks/useLongPress";
import useEntryStore from "../../store/useEntryStore";

type Props = {
  queryPath: QueryPath;
  title: string;
  embedLevel: number;
};

const EntryLink = ({ queryPath, title, embedLevel }: Props) => {
  const linkId = getEntryId(queryPath);
  const isOptimisticEntry = linkId === -1;

  const anchorRef = useRef<HTMLLIElement | null>(null);

  const triggerPopover = useEntryStore(
    (state) => state.modifyEntry.actions.triggerPopover
  );
  const setInputType = useEntryStore(
    (state) => state.modifyEntry.actions.setInputType
  );
  const editPopoverOpen = useEntryStore(
    (store) =>
      !!store.modifyEntry.edit.popoverOpen &&
      store.modifyEntry.queryPath &&
      getEntryId(store.modifyEntry.queryPath) === linkId
  );
  const isEditingEntry = useEntryStore(
    (store) =>
      !!store.modifyEntry.queryPath &&
      getEntryId(store.modifyEntry.queryPath) === linkId &&
      store.modifyEntry.edit.inputActive
  );

  const { registerMouseDown, registerMouseUp } = useLongPress(() => {
    setInputType("link");
    triggerPopover(queryPath, "edit", anchorRef);
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setInputType("link");
    triggerPopover(queryPath, "edit", anchorRef);
  };

  return (
    <li
      ref={anchorRef}
      onContextMenu={handleContextMenu}
      onMouseDown={registerMouseDown}
      onMouseUp={registerMouseUp}
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
            "font-semibold select-none ml-4 font-sans text-neutral-600 whitespace-nowrap overflow-hidden text-ellipsis",
            embedLevel >= 2 && "text-sm"
          )}
        >
          {title}
        </p>
      )}
    </li>
  );
};

export default EntryLink;

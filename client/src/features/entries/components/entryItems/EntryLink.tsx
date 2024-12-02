import EntryInput from "../EntryInput";
import { useRef } from "react";
import clsx from "clsx";
import Icon from "@/components/Icon";
import { QueryPath } from "../../entryTypes";
import { getEntryId } from "../../utils/getEntryId";
import { useEntryStore } from "../../store/EntryStoreProvider";

type Props = {
  queryPath: QueryPath;
  title: string;
  embedLevel: number;
};

const EntryLink = ({ queryPath, title, embedLevel }: Props) => {
  const entryId = getEntryId(queryPath);
  const isOptimisticEntry = entryId === -1;

  const anchorRef = useRef<HTMLLIElement | null>(null);

  const inputType = useEntryStore(
    (store) => store.modifyEntry.edit.inputEntryType
  );

  const editPopoverOpen = useEntryStore(
    (store) =>
      store.modifyEntry.edit.popoverOpen &&
      store.modifyEntry.id.entryId === entryId
  );
  const isEditingEntry = useEntryStore(
    (store) =>
      store.modifyEntry.id.entryId === entryId &&
      store.modifyEntry.edit.inputActive
  );

  return (
    <li
      draggable="true"
      data-querypath={JSON.stringify(queryPath)}
      data-entry-type={"link"}
      data-entry-title={title}
      ref={anchorRef}
      className={clsx(
        "entry flex items-center px-2 hover:bg-gray-50 transition-colors rounded-md cursor-pointer",
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
          queryPath={queryPath}
          inputType={inputType}
          embedLevel={embedLevel}
          defaultValue={title}
          mode="edit"
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

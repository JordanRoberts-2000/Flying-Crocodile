import clsx from "clsx";
import EntryInput from "../EntryInput";
import { QueryPath } from "../../entryTypes";
import getEntryId from "../../utils/getId";
import Icon from "@/components/Icon";
import FolderContent from "./folderContent/FolderContent";
import useEntryStore from "../../store/useEntryStore";

type Props = {
  title: string;
  embedLevel: number;
  queryPath: QueryPath;
};

const EntryFolder = ({ title, embedLevel, queryPath }: Props) => {
  const folderId = getEntryId(queryPath);
  const isOptimisticEntry = folderId === -1;

  const inputType = useEntryStore(
    (store) => store.modifyEntry.edit.inputEntryType
  );

  const folderOpen = useEntryStore((state) =>
    state.folders.openFolders.has(folderId)
  );
  const editPopoverOpen = useEntryStore(
    (state) =>
      state.modifyEntry.edit.popoverOpen &&
      state.modifyEntry.edit.entryId === folderId
  );
  const addPopoverOpen = useEntryStore(
    (state) =>
      state.modifyEntry.add.popoverOpen &&
      state.modifyEntry.add.entryId === folderId
  );
  const isAddingEntry = useEntryStore(
    (store) =>
      store.modifyEntry.add.entryId === folderId &&
      store.modifyEntry.add.inputActive
  );
  const isEditingEntry = useEntryStore(
    (store) =>
      store.modifyEntry.edit.entryId === folderId &&
      store.modifyEntry.edit.inputActive
  );

  return (
    <li
      className={clsx(
        "flex flex-col",
        isOptimisticEntry && "pointer-events-none hover:opacity-15"
      )}
    >
      <div
        data-entry-id={folderId}
        className={clsx(
          "entry folder flex px-2 rounded-md cursor-pointer items-center hover:bg-gray-50 transition-colors",
          embedLevel >= 2 ? "py-1" : "py-2",
          folderOpen && "bg-gray-50",
          (addPopoverOpen || editPopoverOpen) &&
            "outline outline-2 outline-blue-300"
        )}
      >
        <div
          className={clsx(
            "outline-gray-100 outline outline-1 rounded-lg relative group shadow",
            embedLevel >= 2 ? "p-1.5" : "p-2",
            folderOpen && "shadow-blue-300"
          )}
        >
          <button
            data-add-entry="true"
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
            inputType={inputType}
            embedLevel={embedLevel}
            defaultValue={title}
            mode="edit"
            queryPath={queryPath}
          />
        ) : (
          <p
            className={clsx(
              "font-semibold select-none ml-4 font-sans whitespace-nowrap overflow-hidden text-ellipsis",
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
      {folderOpen && (
        <FolderContent
          queryPath={queryPath}
          embedLevel={embedLevel}
          isAddingEntry={isAddingEntry}
        />
      )}
    </li>
  );
};

export default EntryFolder;

import { useRef } from "react";
import FolderIcon from "../../../assets/svgs/folderPlus.svg?react";
import ImageIcon from "../../../assets/svgs/photo.svg?react";
import useCreateEntry from "../hooks/useCreateEntry";
import useUpdateEntry from "../hooks/useEditEntry";
import { AddingEntry, QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";

type Props = {
  addingEntry: Exclude<AddingEntry, false>;
  mode: "add" | "edit";
  queryPath: QueryPath;
  setEditingActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setAddingEntry?: React.Dispatch<React.SetStateAction<AddingEntry>>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const EntryInput = ({
  addingEntry,
  mode,
  queryPath,
  setEditingActive,
  setAddingEntry,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createEntry = useCreateEntry();
  const editEntry = useUpdateEntry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add") {
      createEntry.mutate(
        {
          newEntry: {
            isFolder: addingEntry === "folder",
            title: inputRef.current!.value,
            parentId: getEntryId(queryPath),
          },
        },
        {
          onSuccess: () => {
            console.log("added successfully");
            if (setAddingEntry) setAddingEntry(false);
          },
        }
      );
    }
    if (mode === "edit") {
      editEntry.mutate(
        {
          newTitle: inputRef.current!.value,
          queryPath,
        },
        {
          onSuccess: () => {
            if (setEditingActive) setEditingActive(false);
          },
        }
      );
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full relative">
      {mode === "add" &&
        (addingEntry === "folder" ? (
          <FolderIcon className="size-6 min-w-6 absolute left-4 top-1/2 -translate-y-1/2" />
        ) : (
          <ImageIcon className="size-6 min-w-6 absolute left-4 top-1/2 -translate-y-1/2" />
        ))}

      <input
        {...rest}
        onClick={(e) => e.stopPropagation()}
        className="w-full p-2 pl-14 font-semibold"
        placeholder={addingEntry === "folder" ? "Folder name" : "Gallery name"}
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};

export default EntryInput;

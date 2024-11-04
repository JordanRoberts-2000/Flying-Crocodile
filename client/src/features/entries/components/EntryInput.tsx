import { useRef } from "react";
import useCreateEntry from "../hooks/useCreateEntry";
import useUpdateEntry from "../hooks/useEditEntry";
import { AddingEntry, QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";
import Icon from "@/components/Icon";

type Props = {
  addingEntry: Exclude<AddingEntry, false>;
  embedLevel: number;
  mode: "add" | "edit";
  queryPath: QueryPath;
  setEditingActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setAddingEntry?: React.Dispatch<React.SetStateAction<AddingEntry>>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const EntryInput = ({
  addingEntry,
  embedLevel,
  mode,
  queryPath,
  setEditingActive,
  setAddingEntry,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createEntry = useCreateEntry();
  const editEntry = useUpdateEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add") {
      createEntry.mutate({
        newEntry: {
          isFolder: addingEntry === "folder",
          title: inputRef.current!.value,
          parentId: getEntryId(queryPath),
        },
        queryPath,
        setAddingEntry: setAddingEntry,
      });
    }
    if (mode === "edit") {
      editEntry.mutate({
        newTitle: inputRef.current!.value,
        queryPath,
        setEditingActive,
      });
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full relative">
      {mode === "add" &&
        (addingEntry === "folder" ? (
          <Icon
            name="folderPlus"
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
        ) : (
          <Icon
            name="photo"
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
        ))}

      <input
        {...rest}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${embedLevel >= 2 ? "p-1" : "p-2"} ${
          mode === "add" && "pl-14"
        } font-semibold`}
        placeholder={addingEntry === "folder" ? "Folder name" : "Gallery name"}
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};

export default EntryInput;

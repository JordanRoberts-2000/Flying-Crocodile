import { useRef } from "react";
import useCreateEntry from "../hooks/useCreateEntry";
import useUpdateEntry from "../hooks/useEditEntry";
import { QueryPath } from "../entryTypes";
import getEntryId from "../utils/getId";
import Icon from "@/components/Icon";
import useEntryStore from "../store/useEntryStore";

type Props = {
  embedLevel: number;
  mode: "add" | "edit";
  queryPath: QueryPath;
} & React.InputHTMLAttributes<HTMLInputElement>;

const EntryInput = ({ embedLevel, mode, queryPath, ...rest }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createEntry = useCreateEntry();
  const editEntry = useUpdateEntry();
  const inputType = useEntryStore((store) => store.modifyEntry.inputEntryType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add") {
      createEntry.mutate({
        newEntry: {
          isFolder: inputType === "folder",
          title: inputRef.current!.value,
          parentId: getEntryId(queryPath),
        },
        queryPath,
      });
    }
    if (mode === "edit") {
      editEntry.mutate({
        newTitle: inputRef.current!.value,
        queryPath,
      });
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full relative">
      {mode === "add" &&
        (inputType === "folder" ? (
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
        placeholder={inputType === "folder" ? "Folder name" : "Gallery name"}
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};

export default EntryInput;

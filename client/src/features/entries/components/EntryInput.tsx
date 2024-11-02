import { useRef } from "react";
import FolderIcon from "../../../assets/svgs/folderPlus.svg?react";
import ImageIcon from "../../../assets/svgs/photo.svg?react";
import useCreateEntry from "../hooks/useCreateEntry";
import useEntryStore from "../store";

type Props = {
  entryId: number;
} & React.InputHTMLAttributes<HTMLInputElement>;

const EntryInput = ({ entryId, ...rest }: Props) => {
  const clearInputMode = useEntryStore((state) => state.actions.clearInputMode);
  const entryInputMode = useEntryStore((state) => state.entryInputMode);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mutation = useCreateEntry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entryInputMode.mode === "add") {
      mutation.mutate({
        newEntry: {
          isFolder: entryInputMode.entryType === "folder",
          title: inputRef.current!.value,
          parentId: entryId,
        },
      });
    } else {
      // handle edit mutation
    }
    clearInputMode();
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full relative">
      {entryInputMode.mode === "add" &&
        (entryInputMode.entryType === "folder" ? (
          <FolderIcon className="size-6 absolute left-4 top-1/2 -translate-y-1/2" />
        ) : (
          <ImageIcon className="size-6 absolute left-4 top-1/2 -translate-y-1/2" />
        ))}

      <input
        {...rest}
        onClick={(e) => e.stopPropagation()}
        className="w-full p-2 pl-14 font-semibold"
        placeholder={
          entryInputMode.entryType === "folder" ? "Folder name" : "Gallery name"
        }
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};

export default EntryInput;

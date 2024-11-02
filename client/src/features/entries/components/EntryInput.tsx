import { useRef } from "react";
import FolderIcon from "../../../assets/svgs/folderPlus.svg?react";
import ImageIcon from "../../../assets/svgs/photo.svg?react";
import useCreateEntry from "../hooks/useCreateEntry";
import useEntryStore from "../store";
import useUpdateEntry from "../hooks/useEditEntry";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const EntryInput = ({ ...rest }: Props) => {
  const clearInputMode = useEntryStore((state) => state.actions.clearInputMode);
  const { entryType, id, mode } = useEntryStore(
    (state) => state.entryInputMode
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createEntry = useCreateEntry();
  const editEntry = useUpdateEntry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add") {
      createEntry.mutate({
        newEntry: {
          isFolder: entryType === "folder",
          title: inputRef.current!.value,
          parentId: id,
        },
      });
    } else {
      editEntry.mutate({
        newTitle: inputRef.current!.value,
        entryId: id!,
      });
    }
    clearInputMode();
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full relative">
      {mode === "add" &&
        (entryType === "folder" ? (
          <FolderIcon className="size-6 absolute left-4 top-1/2 -translate-y-1/2" />
        ) : (
          <ImageIcon className="size-6 absolute left-4 top-1/2 -translate-y-1/2" />
        ))}

      <input
        {...rest}
        onClick={(e) => e.stopPropagation()}
        className="w-full p-2 pl-14 font-semibold"
        placeholder={entryType === "folder" ? "Folder name" : "Gallery name"}
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};

export default EntryInput;

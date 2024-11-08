import { useRef } from "react";
import useCreateEntry from "../hooks/useCreateEntry";
import useUpdateEntry from "../hooks/useEditEntry";
import { QueryPath, InputEntryType } from "../entryTypes";
import getEntryId from "../utils/getId";
import Icon from "@/components/Icon";
import useEntryStore from "../store/useEntryStore";
import clsx from "clsx";

type Props = {
  embedLevel: number;
  mode: "add" | "edit";
  queryPath: QueryPath;
  inputType: InputEntryType;
} & React.InputHTMLAttributes<HTMLInputElement>;

const EntryInput = ({
  embedLevel,
  mode,
  queryPath,
  inputType,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createEntry = useCreateEntry();
  const editEntry = useUpdateEntry();
  const setInputActive = useEntryStore(
    (store) => store.modifyEntry.actions.setInputActive
  );

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

  const handleBlur = () => {
    console.log("blur");
    // startTransition(() => {
    //   setInputActive("add", false);
    // });
    setInputActive("add", false);
  };
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      onBlur={() => handleBlur()}
      className={clsx(
        "w-full relative flex items-center focus-within:ring-2 focus-within:ring-blue-500 rounded-md px-2",
        mode === "edit" ? "mx-1" : "py-1"
      )}
    >
      {mode === "add" &&
        (inputType === "folder" ? (
          <div className={clsx(embedLevel >= 2 ? "p-1" : "p-1.5")}>
            <Icon
              name="folderPlus"
              className={clsx(embedLevel >= 2 ? "size-5" : "size-6")}
            />
          </div>
        ) : (
          <div className={clsx(embedLevel >= 2 ? "p-1" : "p-1.5")}>
            <Icon
              name="photo"
              className={clsx(embedLevel >= 2 ? "size-5" : "size-6")}
            />
          </div>
        ))}

      <input
        {...rest}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          `w-full font-semibold focus:outline-none`,
          embedLevel >= 2 ? "text-sm p-1" : "p-2",
          mode === "add" && "pl-4"
        )}
        placeholder={inputType === "folder" ? "Folder name" : "Gallery name"}
        ref={inputRef}
        autoFocus
      />
      <Icon
        name="close"
        className="active:scale-90 transition-transform cursor-pointer"
      />
    </form>
  );
};

export default EntryInput;

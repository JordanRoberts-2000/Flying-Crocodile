import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddingEntry } from "../../entryTypes";
import { EMBEDDED_FOLDER_LIMIT } from "@/constants";
import PhotoIcon from "../../../../assets/svgs/photo.svg?react";
import FolderIcon from "../../../../assets/svgs/folderPlus.svg?react";

type Props = {
  folderId: number;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  embedLevel: number;
  setFolderOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setAddingEntry: React.Dispatch<React.SetStateAction<AddingEntry>>;
  isRoot?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AddEntityPopover = ({
  open,
  onOpenChange,
  folderId,
  embedLevel,
  children,
  isRoot = false,
  setFolderOpen,
  setAddingEntry,
  ...rest
}: Props) => {
  const handleClick = (e: React.MouseEvent, entryType: AddingEntry) => {
    e.stopPropagation();
    setAddingEntry(entryType);
    onOpenChange(false);
    if (setFolderOpen) setFolderOpen(true);
  };

  if (embedLevel > EMBEDDED_FOLDER_LIMIT)
    return (
      <button {...rest} onClick={(e) => handleClick(e, "link")}>
        {children}
      </button>
    );
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        {...rest}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="flex flex-col w-fit p-1 gap-1 ml-2"
      >
        <button
          onClick={(e) => handleClick(e, "folder")}
          className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
        >
          <FolderIcon className="size-5 min-w-5 fill-white" strokeWidth={2} />
          {`New ${isRoot ? "root " : ""}folder`}
        </button>
        <button
          onClick={(e) => handleClick(e, "link")}
          className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
        >
          <PhotoIcon className="size-5 min-w-5 fill-white" strokeWidth={2} />{" "}
          {`New ${isRoot ? "root " : ""}gallery`}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default AddEntityPopover;

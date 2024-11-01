import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useEntryStore from "../store";
import { InputMode } from "../entryTypes";

type Props = {
  folderId: number;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const AddEntityPopover = ({
  open,
  onOpenChange,
  folderId,
  children,
}: Props) => {
  const setInputMode = useEntryStore((state) => state.setInputMode);
  const handleClick = (
    e: React.MouseEvent,
    entryType: InputMode["entryType"]
  ) => {
    e.stopPropagation();
    setInputMode({
      id: folderId,
      mode: "add",
      entryType,
    });
    onOpenChange(false);
  };
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex flex-col w-fit p-1 gap-1">
        <button
          onClick={(e) => handleClick(e, "folder")}
          className="text-left p-2 border-gray-200 border rounded-md"
        >
          + new folder
        </button>
        <button
          onClick={(e) => handleClick(e, "link")}
          className="text-left p-2 border-gray-200 border rounded-md"
        >
          + new gallery
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default AddEntityPopover;

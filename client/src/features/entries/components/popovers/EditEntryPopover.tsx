import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverAnchor } from "@radix-ui/react-popover";
import EditIcon from "../../../../assets/svgs/edit.svg?react";
import BinIcon from "../../../../assets/svgs/bin.svg?react";
import AreYouSureDialog from "../areYouSureDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingActive: React.Dispatch<React.SetStateAction<boolean>>;
  deleteId: number;
  isFolder: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const EditEntityPopover = ({
  open,
  onOpenChange,
  children,
  isFolder,
  setEditingActive,
  deleteId,
}: Props) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingActive(true);
    onOpenChange(false);
  };

  return (
    <div
      onMouseDown={(e) => open && e.stopPropagation()}
      onMouseUp={(e) => open && e.stopPropagation()}
      className="contents"
    >
      <Dialog>
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverAnchor>{children}</PopoverAnchor>
          <PopoverContent className="flex flex-col w-fit p-1 gap-1">
            <button
              onClick={(e) => handleEdit(e)}
              className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
            >
              <EditIcon className="size-5 min-w-5" strokeWidth={2} />
              {`Edit ${isFolder ? "folder" : "link"}`}
            </button>
            <DialogTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
              >
                <BinIcon
                  className="size-5 min-w-5 fill-white"
                  strokeWidth={2}
                />
                {`Delete ${isFolder ? "folder" : "link"}`}
              </button>
            </DialogTrigger>
          </PopoverContent>
        </Popover>
        <AreYouSureDialog entryId={deleteId} />
      </Dialog>
    </div>
  );
};

export default EditEntityPopover;

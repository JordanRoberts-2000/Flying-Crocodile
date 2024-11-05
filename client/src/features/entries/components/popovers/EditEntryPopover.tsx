import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverAnchor } from "@radix-ui/react-popover";
import AreYouSureDialog from "../AreYouSureDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/Icon";
import useEntryStore from "../../store/useEntryStore";

const EditEntityPopover = () => {
  const open = useEntryStore((state) => state.modifyEntry.edit.popoverOpen);
  const setPopoverOpen = useEntryStore(
    (state) => state.modifyEntry.actions.setPopoverOpen
  );
  const setInputActive = useEntryStore(
    (store) => store.modifyEntry.actions.setInputActive
  );
  const isFolder = useEntryStore(
    (state) => state.modifyEntry.inputEntryType === "folder"
  );
  const popoverAnchor = useEntryStore(
    (state) => state.modifyEntry.edit.popoverAnchorRef
  );

  const handleEditSelected = () => {
    setInputActive("edit", true);
    setPopoverOpen("edit", false);
  };

  return (
    <div
      onMouseDown={(e) => open && e.stopPropagation()}
      onMouseUp={(e) => open && e.stopPropagation()}
      className="contents"
    >
      <Dialog>
        <Popover
          open={open}
          onOpenChange={(isOpen) => setPopoverOpen("edit", isOpen)}
        >
          <PopoverAnchor virtualRef={popoverAnchor} />
          <PopoverContent className="flex flex-col w-fit p-1 gap-1">
            <button
              onClick={() => handleEditSelected()}
              className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
            >
              <Icon name="edit" strokeWidth={2} />
              {`Edit ${isFolder ? "folder" : "link"}`}
            </button>
            <DialogTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
              >
                <Icon name="bin" className="fill-white" strokeWidth={2} />
                {`Delete ${isFolder ? "folder" : "link"}`}
              </button>
            </DialogTrigger>
          </PopoverContent>
        </Popover>
        <AreYouSureDialog />
      </Dialog>
    </div>
  );
};

export default EditEntityPopover;

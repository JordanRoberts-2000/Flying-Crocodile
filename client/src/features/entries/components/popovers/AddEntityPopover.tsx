import { Popover, PopoverContent } from "@/components/ui/popover";
import Icon from "@/components/Icon";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { InputEntryType } from "../../entryTypes";
import getEntryId from "../../utils/getId";
import useEntryStore from "../../store/useEntryStore";

type Props = {
  rootId: number;
};

const AddEntityPopover = ({ rootId }: Props) => {
  const open = useEntryStore((state) => state.modifyEntry.add.popoverOpen);
  const setPopoverOpen = useEntryStore(
    (state) => state.modifyEntry.actions.setPopoverOpen
  );
  const isRoot = useEntryStore(
    (store) =>
      store.modifyEntry.queryPath &&
      getEntryId(store.modifyEntry.queryPath) === rootId
  );
  const setInputType = useEntryStore(
    (state) => state.modifyEntry.actions.setInputType
  );
  const popoverAnchor = useEntryStore(
    (state) => state.modifyEntry.add.popoverAnchorRef
  );
  const entryId = useEntryStore(
    (state) =>
      state.modifyEntry.queryPath && getEntryId(state.modifyEntry.queryPath)
  );
  const setInputActive = useEntryStore(
    (store) => store.modifyEntry.actions.setInputActive
  );
  const setFolderOpen = useEntryStore(
    (state) => state.folders.actions.setFolderOpen
  );

  const handleClick = (e: React.MouseEvent, entryType: InputEntryType) => {
    e.stopPropagation();
    setInputType(entryType);
    setInputActive("add", true);
    setPopoverOpen("add", false);
    if (entryId) {
      setFolderOpen(entryId, true);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => setPopoverOpen("add", isOpen)}
    >
      <PopoverAnchor virtualRef={popoverAnchor} />
      <PopoverContent
        side="right"
        className="flex flex-col w-fit p-1 gap-1 ml-2"
      >
        <button
          onClick={(e) => handleClick(e, "folder")}
          className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
        >
          <Icon name="folder" className="fill-white" strokeWidth={2} />
          {`New ${isRoot ? "root " : ""}folder`}
        </button>
        <button
          onClick={(e) => handleClick(e, "link")}
          className="text-left py-2 px-4 text-sm text-neutral-600 font-semibold hover:text-blue-600 hover:bg-blue-50 border-gray-200 border rounded-md gap-4 flex items-center"
        >
          <Icon name="photo" className="fill-white" strokeWidth={2} />
          {`New ${isRoot ? "root " : ""}gallery`}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default AddEntityPopover;

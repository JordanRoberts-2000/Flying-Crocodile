import { useState } from "react";
import EditIcon from "../../../assets/svgs/edit.svg?react";
import BinIcon from "../../../assets/svgs/bin.svg?react";
import ArrowIcon from "../../../assets/svgs/arrow.svg?react";
import FolderIcon from "../../../assets/svgs/folder.svg?react";
import PlusIcon from "../../../assets/svgs/add.svg?react";
import AddEntityPopover from "./AddEntityPopover";
import useEntryStore from "../store";
import EntryInput from "./EntryInput";
import AreYouSureDialog from "./areYouSureDialog";

type Props = {
  id: number;
  title: string;
  embedLevel: number;
};

const EntryFolder = ({ id, title, embedLevel }: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const editMode = useEntryStore((state) => state.editMode);
  const entryInputMode = useEntryStore((state) => state.entryInputMode);
  const setInputMode = useEntryStore((state) => state.setInputMode);

  // Get embedded entries for this folder id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputMode({
      id: id,
      mode: "edit",
      entryType: "folder",
    });
  };

  return (
    <li className="flex flex-col">
      <div
        className={`flex ${
          embedLevel >= 2 ? "py-1" : "py-2"
        } px-2 rounded-md cursor-pointer items-center ${
          folderOpen && "bg-neutral-100"
        }`}
        onClick={() => setFolderOpen((prev) => !prev)}
      >
        {editMode ? (
          <AddEntityPopover
            folderId={id}
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="border-neutral-200 p-1 flex items-center justify-center border size-6 rounded-full"
            >
              <PlusIcon className="size-4" />
            </button>
          </AddEntityPopover>
        ) : (
          <FolderIcon
            className={`${
              embedLevel >= 2
                ? "size-5 min-h-5 min-w-5"
                : "size-6 min-h-6 min-w-6"
            }`}
          />
        )}
        {entryInputMode.id === id && entryInputMode.mode === "edit" ? (
          <EntryInput
            entryInputMode={entryInputMode}
            entryId={id}
            defaultValue={title}
          />
        ) : (
          <p
            className={`${
              embedLevel >= 2 && "text-sm"
            } font-semibold ml-4 font-sans text-neutral-800 whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            {title}
          </p>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ArrowIcon
            className={`size-6 transition-transform duration-300 ${
              folderOpen && "rotate-90"
            }`}
          />
          {editMode && (
            <>
              <button onClick={(e) => handleClick(e)}>
                <EditIcon className="text-gray-400 size-5" />
              </button>
              <AreYouSureDialog>
                <BinIcon className="text-red-400 size-5" />
              </AreYouSureDialog>
            </>
          )}
        </div>
      </div>
      {/* {open && (!!categories.length || addFolder) && (
        <div className="flex py-1 pr-2">
          <Separator orientation="vertical" className="ml-2" />
          <ul className="flex flex-col pl-2 w-full gap-0.5">
            {addFolder && (
              <li>
                <GalleryInput
                  addFolder={addFolder}
                  setAddFolder={setAddFolder}
                  setGalleryItems={setCategories}
                />
              </li>
            )}
            {categories.map((data) =>
              !data.subcategories ? (
                <GalleryItem
                  id={data.id}
                  key={data.id}
                  embedLevel={embedLevel + 1}
                  setParentCategories={setCategories}
                  title={data.title}
                />
              ) : (
                <GalleryFolder
                  id={data.id}
                  embedLevel={embedLevel + 1}
                  setParentCategories={setCategories}
                  key={data.id}
                  title={data.title}
                  subcategories={data.subcategories}
                />
              )
            )}
          </ul>
        </div>
      )} */}
    </li>
  );
};

export default EntryFolder;

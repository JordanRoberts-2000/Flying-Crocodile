import useSideBarStore from "@/sidebarStore";
import { useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { GalleryItemType, sortGalleryItems } from "./AppSidebar";
import GalleryItem from "./GalleryItem";
import GalleryInput from "./GalleryInput";
import EditIcon from "../assets/svgs/edit.svg?react";
import BinIcon from "../assets/svgs/bin.svg?react";
import ArrowIcon from "../assets/svgs/arrow.svg?react";
import FolderIcon from "../assets/svgs/folder.svg?react";
import PlusIcon from "../assets/svgs/add.svg?react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  id: string | number;
  title: string;
  subcategories: GalleryItemType[];
  embedLevel: number;
  setParentCategories: React.Dispatch<React.SetStateAction<GalleryItemType[]>>;
};

const GalleryFolder = ({
  id,
  title,
  subcategories,
  embedLevel,
  setParentCategories,
}: Props) => {
  const [categories, setCategories] = useState<GalleryItemType[]>(
    sortGalleryItems(subcategories)
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [addFolder, setAddFolder] = useState<"folder" | "gallery" | false>(
    false
  );
  const [editing, setEditing] = useState(false);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const addCategoryMode = useSideBarStore((state) => state.addCategoryMode);
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setParentCategories((prevCategories) =>
      sortGalleryItems(prevCategories.filter((item) => item.id !== id))
    );
  };

  return (
    <li className="flex flex-col">
      <div
        className={`flex ${
          embedLevel >= 2 ? "py-1" : "py-2"
        } px-2 rounded-md cursor-pointer items-center ${
          open && "bg-neutral-100"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {addCategoryMode ? (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              onClick={(e) => {
                e.stopPropagation();
                if (!open) setOpen(true);
              }}
              className="border-neutral-200 p-1 flex items-center justify-center border size-6 rounded-full"
            >
              <PlusIcon className="size-4" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-fit p-1 gap-1">
              {embedLevel <= 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddFolder("folder");
                    setPopoverOpen(false);
                  }}
                  className="text-left p-2 border-gray-200 border rounded-md"
                >
                  + new folder
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAddFolder("gallery");
                  setPopoverOpen(false);
                }}
                className="text-left p-2 border-gray-200 border rounded-md"
              >
                + new gallery
              </button>
            </PopoverContent>
          </Popover>
        ) : (
          <FolderIcon
            className={`${
              embedLevel >= 2
                ? "size-5 min-h-5 min-w-5"
                : "size-6 min-h-6 min-w-6"
            }`}
          />
        )}
        {editing ? (
          <form
            className="w-full mx-2"
            onSubmit={(e) => {
              e.preventDefault();
              setEditing(false);
              setParentCategories((prevCategories) =>
                sortGalleryItems(
                  prevCategories.map((item) =>
                    item.id === id
                      ? { ...item, title: editInputRef.current!.value }
                      : item
                  )
                )
              );
            }}
          >
            <input
              ref={editInputRef}
              autoFocus
              className="w-full px-2 font-semibold"
              defaultValue={title}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </form>
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
              open && "rotate-90"
            }`}
          />
          {addCategoryMode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                  setOpen(false);
                }}
              >
                <EditIcon className="text-gray-400 size-5" />
              </button>
              <div onClick={(e) => e.stopPropagation()} className="contents">
                <Dialog>
                  <DialogTrigger>
                    <BinIcon className="text-red-400 size-5" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete all data and embeded galleries
                      </DialogDescription>
                    </DialogHeader>
                    <div className="gap-4">
                      <DialogClose asChild>
                        <button className="px-4 py-2 rounded-md">Cancel</button>
                      </DialogClose>
                      <button
                        className="px-4 py-2 bg-red-800 text-white rounded-md"
                        onClick={(e) => handleDelete(e)}
                      >
                        Delete
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </div>
      </div>
      {open && (!!categories.length || addFolder) && (
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
      )}
    </li>
  );
};

export default GalleryFolder;

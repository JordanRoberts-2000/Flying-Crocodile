import useSideBarStore from "@/sidebarStore";
import ImageIcon from "../assets/svgs/photo.svg?react";
import EditIcon from "../assets/svgs/edit.svg?react";
import BinIcon from "../assets/svgs/bin.svg?react";
import { GalleryItemType, sortGalleryItems } from "./AppSidebar";
import { useRef, useState } from "react";
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
  embedLevel: number;
  setParentCategories: React.Dispatch<React.SetStateAction<GalleryItemType[]>>;
};

const GalleryItem = ({ id, title, embedLevel, setParentCategories }: Props) => {
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
    <li className="flex items-center py-2 px-2">
      <ImageIcon
        className={`${addCategoryMode && "opacity-15"} ${
          embedLevel >= 2 ? "size-5" : "size-6 min-h-6 min-w-6"
        }`}
      />
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
      {addCategoryMode && (
        <div className="flex ml-auto items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
          >
            <EditIcon className="text-gray-400 size-5" />
          </button>
          <Dialog>
            <DialogTrigger>
              <BinIcon className="text-red-400 size-5" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete all
                  data and embeded galleries
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
      )}
    </li>
  );
};

export default GalleryItem;

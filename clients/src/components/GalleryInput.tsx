import { useRef } from "react";
import { GalleryItemType, sortGalleryItems } from "./AppSidebar";
import { v4 as uuidv4 } from "uuid";
import FolderIcon from "../assets/svgs/folderPlus.svg?react";
import ImageIcon from "../assets/svgs/photo.svg?react";

type Props = {
  addFolder: "folder" | "gallery";
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItemType[]>>;
  setAddFolder: React.Dispatch<
    React.SetStateAction<"folder" | "gallery" | false>
  >;
};

const GalleryInput = ({ addFolder, setGalleryItems, setAddFolder }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addFolder === "folder") {
      setGalleryItems((prev) =>
        sortGalleryItems([
          ...prev,
          {
            id: uuidv4(),
            title: inputRef.current!.value,
            subcategories: [],
          },
        ])
      );
    }
    if (addFolder === "gallery") {
      setGalleryItems((prev) =>
        sortGalleryItems([
          ...prev,
          {
            id: uuidv4(),
            title: inputRef.current!.value,
            subcategories: false,
          },
        ])
      );
    }
    setAddFolder(false);
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full relative">
      {addFolder === "folder" ? (
        <FolderIcon className="size-6 absolute left-4 top-1/2 -translate-y-1/2" />
      ) : (
        <ImageIcon className="size-6 absolute left-4 top-1/2 -translate-y-1/2" />
      )}

      <input
        className="w-full p-2 pl-14"
        placeholder={addFolder === "folder" ? "Folder name" : "Gallery name"}
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};

export default GalleryInput;

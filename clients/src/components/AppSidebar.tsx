import { Separator } from "./ui/separator";
import { SheetContent, SheetFooter } from "./ui/sheet";
import mockData from "../mockData.json";
import { useEffect, useRef, useState } from "react";
import useSideBarStore from "@/sidebarStore";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import GalleryItem from "./GalleryItem";
import GalleryFolder from "./GalleryFolder";

export type GalleryItemType = {
  id: number;
  title: string;
  subcategories: GalleryItemType[] | false;
};

export function sortGalleryItems(data: GalleryItemType[]) {
  const sortedGalleryItems = data.sort((a, b) => {
    if (a.subcategories && !b.subcategories) return -1;
    if (!a.subcategories && b.subcategories) return 1;
    return a.title.localeCompare(b.title);
  });
  return sortedGalleryItems;
}

const AppSidebar = ({}) => {
  const addCategoryMode = useSideBarStore((state) => state.addCategoryMode);
  const [galleryItems, setGalleryItems] = useState(
    sortGalleryItems(mockData as GalleryItemType[])
  );
  const inputRef = useRef(null);

  return (
    <SheetContent side={"left"} className="flex flex-col p-0 gap-0">
      <div className="flex gap-4 items-center p-2">
        <div className="size-8 bg-gray-500 rounded-full"></div>
        <p>Admin</p>
      </div>
      <div className="p-2 flex-1 flex flex-col">
        {(addCategoryMode || !galleryItems.length) && (
          <button className="border border-gray-200 py-2 rounded-md">
            Add to main folder
          </button>
        )}
        <ul className="flex flex-col flex-1 text-xl pt-4 font-semibold">
          {galleryItems.map((data) =>
            !data.subcategories ? (
              <GalleryItem key={data.id} title={data.title} />
            ) : (
              <GalleryFolder
                key={data.id}
                title={data.title}
                subcategories={data.subcategories}
              />
            )
          )}
        </ul>
        <Separator />
      </div>
      <SheetFooter>
        <div className="p-4">
          <button
            className="border border-neutral-200 rounded-md px-4 py-2"
            onClick={() => {
              useSideBarStore.setState(() => ({ addCategoryMode: true }));
            }}
          >
            Edit
          </button>
          <button
            className="bg-red-700 text-white rounded-md px-4 py-2"
            onClick={() => {
              if (addCategoryMode) {
                useSideBarStore.setState(() => ({ addCategoryMode: false }));
              }
            }}
          >
            Upload file(s)
          </button>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

export default AppSidebar;

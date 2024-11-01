import { Separator } from "./ui/separator";
import { SheetContent, SheetFooter } from "./ui/sheet";
import mockData from "../mockData.json";
import { useState } from "react";
import useSideBarStore from "@/sidebarStore";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import GalleryItem from "./GalleryItem";
import GalleryFolder from "./GalleryFolder";
import GalleryInput from "./GalleryInput";
import UserIcon from "../assets/svgs/user.svg?react";

export type GalleryItemType = {
  id: number | string;
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [addFolder, setAddFolder] = useState<"folder" | "gallery" | false>(
    false
  );

  return (
    <SheetContent side={"left"} className="flex flex-col p-0 gap-0">
      <button
        className="bg-yellow-400 p-2"
        onClick={async () => {
          const res = await fetch("/api/items/galleries");
          if (res.ok) {
            const data = await res.json();
            console.log(data);
          } else {
            console.log("request failed");
          }
        }}
      >
        Fetch
      </button>
      <div className="flex gap-4 items-center p-2 bg-neutral-100">
        <div className="bg-green-50 p-1 rounded-md shadow">
          <UserIcon className="size-6 text-green-700" />
        </div>
        <p className="text-sm">Jordanroberts333@icloud.com</p>
      </div>
      <div className="flex px-4 text-xl mt-2 gap-1">
        <div className="border-black border-b-2 py-1 pl-1 flex-1">
          Galleries
        </div>
        <div className="border-neutral-300 text-neutral-300 border-b-2 py-1 pl-1 flex-1">
          Notes
        </div>
        <div className="border-neutral-300 text-neutral-300 border-b-2 py-1 pl-1 flex-1">
          Fonts
        </div>
      </div>
      <div className="px-2 flex-1 flex flex-col">
        {(addCategoryMode || !galleryItems.length) && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger className="border border-gray-200 py-2 mt-4 rounded-md">
              Add to main folder
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-fit p-1 gap-1">
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
        )}
        <ul className="flex flex-col flex-1 pt-4 gap-0.5">
          {addFolder && (
            <GalleryInput
              addFolder={addFolder}
              setGalleryItems={setGalleryItems}
              setAddFolder={setAddFolder}
            />
          )}
          {galleryItems.map((data) =>
            !data.subcategories ? (
              <GalleryItem
                key={data.id}
                embedLevel={1}
                title={data.title}
                setParentCategories={setGalleryItems}
                id={data.id}
              />
            ) : (
              <GalleryFolder
                key={data.id}
                id={data.id}
                embedLevel={1}
                title={data.title}
                subcategories={data.subcategories}
                setParentCategories={setGalleryItems}
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
              useSideBarStore.setState((state) => ({
                addCategoryMode: !state.addCategoryMode,
              }));
            }}
          >
            {addCategoryMode ? "Cancel" : "Edit"}
          </button>
          <button className="bg-red-700 text-white rounded-md px-4 py-2">
            Upload file(s)
          </button>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

export default AppSidebar;

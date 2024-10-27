import { Separator } from "./ui/separator";
import { SheetContent, SheetFooter } from "./ui/sheet";
import mockData from "../mockData.json";
import { useRef, useState } from "react";
import useSideBarStore from "@/sidebarStore";

const AppSidebar = ({}) => {
  const addCategoryMode = useSideBarStore((state) => state.addCategoryMode);
  const [galleryItems, setGalleryItems] = useState(mockData);
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <SheetContent side={"left"} className="flex flex-col p-0 gap-0">
      <div className="flex gap-4 items-center p-4">
        <div className="size-8 bg-gray-500 rounded-full"></div>
        <p>Admin</p>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <ul className="flex flex-col flex-1 text-xl pt-4 font-semibold gap-2">
          {galleryItems.map((data) => (
            <div key={data.id}>{data.title}</div>
          ))}
          {addCategoryMode && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setGalleryItems((prev) => [
                  ...prev,
                  {
                    id: prev.length + 2,
                    parentId: null,
                    title: inputRef.current!.value,
                  },
                ]);
                useSideBarStore.setState(() => ({ addCategoryMode: false }));
              }}
            >
              <input
                ref={inputRef}
                className="border-red-700 border-2"
                autoFocus
              />
            </form>
          )}
        </ul>
        <Separator />
      </div>
      <SheetFooter>
        <div className="p-4">
          <button
            className="bg-black text-white rounded-md px-4 py-2"
            onClick={() => {
              if (addCategoryMode) {
                setGalleryItems((prev) => [
                  ...prev,
                  {
                    id: prev.length + 2,
                    parentId: null,
                    title: inputRef.current!.value,
                  },
                ]);
                useSideBarStore.setState(() => ({ addCategoryMode: false }));
              } else {
                useSideBarStore.setState(() => ({ addCategoryMode: true }));
              }
            }}
          >
            {addCategoryMode ? "Confirm" : "Add category"}
          </button>
          <button
            className="bg-red-700 text-white rounded-md px-4 py-2"
            onClick={() => {
              if (addCategoryMode) {
                useSideBarStore.setState(() => ({ addCategoryMode: false }));
              }
            }}
          >
            {addCategoryMode ? "Cancel" : "Add file(s)"}
          </button>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

export default AppSidebar;

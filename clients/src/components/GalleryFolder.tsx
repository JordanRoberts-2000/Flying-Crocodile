import useSideBarStore from "@/sidebarStore";
import { useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { GalleryItemType, sortGalleryItems } from "./AppSidebar";
import GalleryItem from "./GalleryItem";

type Props = {
  title: string;
  subcategories: GalleryItemType[];
};

const GalleryFolder = ({ title, subcategories }: Props) => {
  const [categories, setCategories] = useState<GalleryItemType[]>(
    sortGalleryItems(subcategories)
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [addFolder, setAddFolder] = useState<"folder" | "gallery" | false>(
    false
  );
  const [editFolder, setEditFolder] = useState(false);
  const addCategoryMode = useSideBarStore((state) => state.addCategoryMode);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <li className="flex flex-col">
      <div
        className={`flex py-2 px-4 rounded-md cursor-pointer ${
          open && "bg-neutral-100"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {addCategoryMode && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              onClick={(e) => {
                e.stopPropagation();
                if (!open) setOpen(true);
              }}
              className="border-neutral-200 p-1 flex items-center justify-center border size-6 rounded-full mr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
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
        <p className="text-lg font-sans text-neutral-800">{title}</p>

        <div className="ml-auto flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-6 transition-transform duration-300 ${
              open && "rotate-90"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          {addCategoryMode && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </>
          )}
        </div>
      </div>
      {open && (
        <div className="flex p-4">
          <Separator orientation="vertical" />
          <ul className="flex flex-col gap-4 pl-4 w-full">
            {categories.map((data) =>
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
            {addFolder && (
              <li>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (addFolder === "folder") {
                      setCategories((prev) => [
                        ...prev,
                        {
                          id: categories.length + 10,
                          title: inputRef.current!.value,
                          subcategories: [],
                        },
                      ]);
                    }
                    if (addFolder === "gallery") {
                      setCategories((prev) => [
                        ...prev,
                        {
                          id: categories.length + 10,
                          title: inputRef.current!.value,
                          subcategories: false,
                        },
                      ]);
                    }
                    setAddFolder(false);
                  }}
                >
                  <input ref={inputRef} autoFocus />
                </form>
              </li>
            )}
          </ul>
        </div>
      )}
    </li>
  );
};

export default GalleryFolder;

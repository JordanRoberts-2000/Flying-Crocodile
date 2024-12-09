import { SheetContent, SheetFooter, SheetTitle } from "./ui/sheet";
import Icon from "./Icon";
import EntrySection from "@/features/entries/components/EntrySection";

const AppSidebar = () => {
  return (
    <SheetContent side={"left"} className="flex flex-col p-0 gap-0">
      <SheetTitle className="hidden">hello</SheetTitle>
      <div className="flex gap-4 items-center p-2 bg-neutral-100">
        <div className="bg-green-50 p-1 rounded-md shadow">
          <Icon name="user" className="size-6 text-green-700" />
        </div>
        <p className="text-sm">Jordanroberts333@icloud.com</p>
      </div>
      <div className="flex px-4 text-xl mt-2 gap-1">
        <div className="border-black border-b-2 py-1 pl-1 flex-1">Public</div>
        <div className="border-neutral-300 text-neutral-300 border-b-2 py-1 pl-1 flex-1">
          Private
        </div>
      </div>
      <EntrySection />
      <SheetFooter>
        <div className="p-4">
          <button className="bg-red-700 text-white rounded-md px-4 py-2">
            Upload file(s)
          </button>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

export default AppSidebar;

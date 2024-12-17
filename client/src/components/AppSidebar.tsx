import { SheetContent, SheetTitle } from "./ui/sheet";
import Icon from "./Icon";
import FileExplorer from "@/features/fileExplorer/components/FileExplorer";

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
      <FileExplorer />
    </SheetContent>
  );
};

export default AppSidebar;

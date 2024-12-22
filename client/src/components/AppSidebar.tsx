import { SheetContent, SheetTitle } from "./ui/sheet";
import FileExplorer from "@/features/fileExplorer/components/FileExplorer";
import ProfileSection from "@/features/profile/components/ProfileSection";

const AppSidebar = () => {
  return (
    <SheetContent side={"left"} className="flex flex-col p-0 gap-0">
      <SheetTitle className="hidden">hello</SheetTitle>
      <ProfileSection />
      <FileExplorer />
    </SheetContent>
  );
};

export default AppSidebar;

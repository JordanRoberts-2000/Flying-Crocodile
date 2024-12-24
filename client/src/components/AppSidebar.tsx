import FileExplorer from "@/features/fileExplorer/components/FileExplorer";
import ProfileSection from "@/features/profile/components/ProfileSection";

const AppSidebar = () => {
  return (
    <>
      <ProfileSection />
      <FileExplorer />
    </>
  );
};

export default AppSidebar;

import { useEffect } from "react";
import AppSidebar from "./components/AppSidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAdminStatus } from "./features/auth/useAdminStatus";
import Gallery from "./features/gallery/Gallery";

function App() {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["adminStatus"],
      queryFn: () => fetchAdminStatus(),
    });
  }, []);
  return (
    <div className="h-screen flex flex-col">
      <header>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button>Open</button>
            </SheetTrigger>
            <SheetContent side={"left"} className="flex flex-col p-0 gap-0">
              <SheetTitle className="hidden">hello</SheetTitle>
              <AppSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex flex-1 overflow-y-auto">
        <div className="lg:block hidden w-[20%]">
          <AppSidebar />
        </div>
        <div className="flex-1 bg-blue-100 min-h-0 overflow-y-auto flex">
          <Gallery />
        </div>
      </main>
    </div>
  );
}

export default App;

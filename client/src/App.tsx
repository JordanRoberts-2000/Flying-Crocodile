import { useEffect } from "react";
import AppSidebar from "./components/AppSidebar";
import { Sheet, SheetTrigger } from "./components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAdminStatus } from "./features/auth/useAdminStatus";

function App() {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["adminStatus"],
      queryFn: () => fetchAdminStatus(),
    });
  }, []);
  return (
    <div className="bg-blue-500 dark:bg-red-500 transition-colors">
      <header>
        <Sheet>
          <SheetTrigger asChild>
            <button>Open</button>
          </SheetTrigger>
          <AppSidebar />
        </Sheet>
      </header>
      new project
    </div>
  );
}

export default App;

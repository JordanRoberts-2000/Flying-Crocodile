import AppSidebar from "./components/AppSidebar";
import { Sheet, SheetTrigger } from "./components/ui/sheet";
import useSideBarStore from "./sidebarStore";

function App() {
  return (
    <div>
      <header>
        <Sheet
          onOpenChange={() =>
            useSideBarStore.setState(() => ({ addCategoryMode: false }))
          }
        >
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

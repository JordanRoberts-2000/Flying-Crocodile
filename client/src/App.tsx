import AppSidebar from "./components/AppSidebar";
import { Sheet, SheetTrigger } from "./components/ui/sheet";
import useEntryStore from "./features/entries/store";

function App() {
  return (
    <div>
      <header>
        <Sheet
          onOpenChange={() =>
            useEntryStore.setState(() => ({ editMode: false }))
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

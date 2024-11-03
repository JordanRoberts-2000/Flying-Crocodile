import AppSidebar from "./components/AppSidebar";
import { Sheet, SheetTrigger } from "./components/ui/sheet";

function App() {
  return (
    <div>
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

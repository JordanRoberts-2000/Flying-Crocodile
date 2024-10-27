import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";

const AppSidebar = ({}) => {
  return (
    <SheetContent side={"left"}>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">body</div>
      <SheetFooter>
        <SheetClose asChild>
          <button type="submit">Save changes</button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default AppSidebar;

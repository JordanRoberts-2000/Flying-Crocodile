import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const areYouSureDialog = ({ children }: { children: React.ReactNode }) => {
  const handleDeleteEntry = () => {
    console.log("delete");
    // trigger are you sure
    // delete mutation
  };
  return (
    <div onClick={(e) => e.stopPropagation()} className="contents">
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete all
              data and embeded galleries
            </DialogDescription>
          </DialogHeader>
          <div className="gap-4">
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-md">Cancel</button>
            </DialogClose>
            <button
              className="px-4 py-2 bg-red-800 text-white rounded-md"
              onClick={() => handleDeleteEntry()}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default areYouSureDialog;

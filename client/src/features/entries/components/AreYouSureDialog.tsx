import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useDeleteEntry from "../hooks/useDeleteEntry";

type Props = {
  entryId: number;
  children: React.ReactNode;
};

const areYouSureDialog = ({ children, entryId }: Props) => {
  const deleteEntry = useDeleteEntry();
  const handleDeleteEntry = () => {
    deleteEntry.mutate(entryId);
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
            <DialogClose asChild>
              <button
                className="px-4 py-2 bg-red-800 text-white rounded-md"
                onClick={() => handleDeleteEntry()}
              >
                Delete
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default areYouSureDialog;

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDeleteEntry from "../hooks/useDeleteEntry";
import { QueryPath } from "../entryTypes";

type Props = {
  queryPath: QueryPath;
};

const AreYouSureDialog = ({ queryPath }: Props) => {
  const deleteEntry = useDeleteEntry();
  const handleDeleteEntry = () => {
    deleteEntry.mutate(queryPath);
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete all data
          and embeded galleries
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
  );
};

export default AreYouSureDialog;

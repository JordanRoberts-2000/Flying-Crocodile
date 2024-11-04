import { Separator } from "@/components/ui/separator";
import EntryInput from "../../EntryInput";
import EntryFolder from "../EntryFolder";
import EntryLink from "../EntryLink";
import useGetEntries from "../../../hooks/useGetEntries";
import { AddingEntry, QueryPath } from "../../../entryTypes";
import FolderContentLoading from "./FolderContent.loading";
import FolderContentError from "./FolderContent.error";
import getEntryId from "@/features/entries/utils/getId";

type Props = {
  queryPath: QueryPath;
  embedLevel: number;
  setAddingEntry: React.Dispatch<React.SetStateAction<AddingEntry>>;
  addingEntry: AddingEntry;
};

const FolderContent = ({
  queryPath,
  embedLevel,
  setAddingEntry,
  addingEntry,
}: Props) => {
  const { data: entries, isError, isPending } = useGetEntries(queryPath);

  if (isPending) return <FolderContentLoading />;
  if (isError) return <FolderContentError />;
  if (!!!entries.length && !addingEntry) return null;
  return (
    <div
      className="flex py-1 pr-2"
      style={{ viewTransitionName: `entry-content-${getEntryId(queryPath)}` }}
    >
      <Separator orientation="vertical" className="ml-4" />
      <ul className="flex flex-col pl-2 w-full gap-0.5">
        {addingEntry && (
          <li>
            <EntryInput
              embedLevel={embedLevel + 1}
              addingEntry={addingEntry}
              mode="add"
              queryPath={queryPath}
              setAddingEntry={setAddingEntry}
            />
          </li>
        )}
        {entries.map((entry) =>
          entry.isFolder ? (
            <EntryFolder
              key={entry.id}
              embedLevel={embedLevel + 1}
              title={entry.title}
              queryPath={[...queryPath, entry.id]}
            />
          ) : (
            <EntryLink
              key={entry.id}
              embedLevel={embedLevel + 1}
              title={entry.title}
              queryPath={[...queryPath, entry.id]}
            />
          )
        )}
      </ul>
    </div>
  );
};

export default FolderContent;

import useGetEntries from "../hooks/useGetEntries";
import EntryStoreProvider from "../store/EntryStoreProvider";
import Entries from "./rootEntries/Entries";

const FileExplorer = ({}) => {
  // const { rootId, entries, isError, isPending } = useGetEntries("gallery");
  // if (isPending) return <>Loading</>;
  // if (isError) return <>Error</>;
  return (
    // <EntryStoreProvider queryPath={["entries", rootId]}>
    // <CategorySelection />
    //   {/* <Entries entries={entries} rootId={rootId} /> */}
    // </EntryStoreProvider>
    <>File Explorer</>
  );
};

export default FileExplorer;

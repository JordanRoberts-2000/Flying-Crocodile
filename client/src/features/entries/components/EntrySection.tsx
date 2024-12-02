import useGetRootEntries from "../hooks/useGetRootEntry";
import EntryStoreProvider from "../store/EntryStoreProvider";
import Entries from "./rootEntries/Entries";

const EntrySection = ({}) => {
  const { rootId, entries, isError, isPending } = useGetRootEntries("public");
  if (isPending) return <>Loading</>;
  if (isError) return <>Error</>;
  return (
    <EntryStoreProvider queryPath={["entries", rootId]}>
      {/* <Entries entries={entries} rootId={rootId} /> */}
    </EntryStoreProvider>
  );
};

export default EntrySection;

import { useEntryStore } from "../store/EntryStoreProvider";

const EntryDragCover = ({}) => {
  const { title, isFolder } = useEntryStore(
    (state) => state.dragging.dragCover
  );
  return (
    <div
      id="custom-drag-preview"
      className="-translate-x-[200vw] bg-blue-400 fixed"
    >
      {title}
    </div>
  );
};

export default EntryDragCover;

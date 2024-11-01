import ImageIcon from "../../../assets/svgs/photo.svg?react";
import EditIcon from "../../../assets/svgs/edit.svg?react";
import BinIcon from "../../../assets/svgs/bin.svg?react";
import useEntryStore from "../store";
import EntryInput from "./EntryInput";
import AreYouSureDialog from "./areYouSureDialog";

type Props = {
  id: number;
  title: string;
  embedLevel: number;
};

const EntryLink = ({ id, title, embedLevel }: Props) => {
  const editMode = useEntryStore((state) => state.editMode);
  const entryInputMode = useEntryStore((state) => state.entryInputMode);
  const setInputMode = useEntryStore((state) => state.setInputMode);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputMode({
      id: id,
      mode: "edit",
      entryType: "link",
    });
  };

  return (
    <li className="flex items-center py-2 px-2">
      <ImageIcon
        className={`${editMode && "opacity-15"} ${
          embedLevel >= 2 ? "size-5" : "size-6 min-h-6 min-w-6"
        }`}
      />
      {entryInputMode.id === id && entryInputMode.mode === "edit" ? (
        <EntryInput
          entryInputMode={entryInputMode}
          entryId={id}
          defaultValue={title}
        />
      ) : (
        <p
          className={`${
            embedLevel >= 2 && "text-sm"
          } font-semibold ml-4 font-sans text-neutral-800 whitespace-nowrap overflow-hidden text-ellipsis`}
        >
          {title}
        </p>
      )}
      {editMode && (
        <div className="flex ml-auto items-center gap-2">
          <button onClick={(e) => handleClick(e)}>
            <EditIcon className="text-gray-400 size-5" />
          </button>
          <AreYouSureDialog>
            <BinIcon className="text-red-400 size-5" />
          </AreYouSureDialog>
        </div>
      )}
    </li>
  );
};

export default EntryLink;

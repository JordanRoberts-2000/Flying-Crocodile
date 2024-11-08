import { useRef } from "react";
import useEntryStore from "../store/useEntryStore";
import useLongPress from "@/hooks/useLongPress";

const useEntryInteractions = () => {
  const addAnchorRef = useRef<Element | null>(null);
  const editAnchorRef = useRef<Element | null>(null);

  const setFolderOpen = useEntryStore(
    (state) => state.folders.actions.setFolderOpen
  );

  const triggerPopover = useEntryStore(
    (state) => state.modifyEntry.actions.triggerPopover
  );

  const setInputType = useEntryStore(
    (state) => state.modifyEntry.actions.setInputType
  );

  const { longPressHandlers, longPressSuccess } = useLongPress((e) => {
    const entry = (e.target as HTMLElement).closest(
      ".entry"
    ) as HTMLElement | null;
    const entryId = entry?.getAttribute("data-entry-id");

    if (entryId) {
      const entryIdInt = parseInt(entryId, 10);
      if (!isNaN(entryIdInt)) {
        editAnchorRef.current = entry;
        setInputType("edit", "folder");
        triggerPopover(entryIdInt, "edit", editAnchorRef);
      }
    }
  });

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const entry = (e.target as HTMLElement).closest(
      ".entry"
    ) as HTMLElement | null;
    const entryId = entry?.getAttribute("data-entry-id");

    if (entryId) {
      const entryIdInt = parseInt(entryId, 10);
      if (!isNaN(entryIdInt)) {
        editAnchorRef.current = entry;
        setInputType("edit", "folder");
        triggerPopover(entryIdInt, "edit", editAnchorRef);
      }
    }
  };

  const onClick = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (!longPressSuccess.current) {
      const entry = (e.target as HTMLElement).closest(
        ".folder"
      ) as HTMLElement | null;
      const entryId = entry?.getAttribute("data-entry-id");

      if (entryId) {
        const entryIdInt = parseInt(entryId);
        if (!isNaN(entryIdInt)) {
          const isAddButton = (e.target as HTMLElement).closest(
            '[data-add-entry="true"]'
          );

          if (isAddButton) {
            addAnchorRef.current = isAddButton;
            triggerPopover(entryIdInt, "add", addAnchorRef);
          } else {
            setFolderOpen(entryIdInt, (prev) => !prev);
          }
        }
      }
    }
  };

  return {
    ...longPressHandlers,
    onClick,
    onContextMenu,
  };
};

export default useEntryInteractions;

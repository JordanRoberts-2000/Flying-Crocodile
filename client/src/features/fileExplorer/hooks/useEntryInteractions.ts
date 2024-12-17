import { useContext, useRef } from "react";
import useLongPress from "@/hooks/useLongPress";
// import useMoveEntry from "./useMoveEntry";
import { InputEntryType, QueryPath } from "../entryTypes";
import { getEntryId, getEntryParentId } from "../utils/getEntryId";
import { EntryContext, useEntryStore } from "../store/EntryStoreProvider";

const useEntryInteractions = () => {
  const addAnchorRef = useRef<Element | null>(null);
  const editAnchorRef = useRef<Element | null>(null);
  const isDragging = useRef(false);
  const dragOverElement = useRef<Element | null>(null);
  const dragStartQueryPath = useRef<QueryPath | null>(null);
  const dragOverQueryPath = useRef<QueryPath | null>(null);

  // const moveEntry = useMoveEntry();

  // const { title, isFolder } = useEntryStore(
  //   (state) => state.dragging.dragCover
  // );

  const setFolderOpen = useEntryStore(
    (state) => state.folders.actions.setFolderOpen
  );

  const triggerPopover = useEntryStore(
    (state) => state.modifyEntry.actions.triggerPopover
  );

  const setInputType = useEntryStore(
    (state) => state.modifyEntry.actions.setInputType
  );

  const setDragCover = useEntryStore(
    (state) => state.dragging.actions.setDragCover
  );

  const { longPressHandlers, longPressSuccess } = useLongPress((e) => {
    if (isDragging.current) return;
    const entry = (e.target as HTMLElement).closest(".entry");
    if (!entry) return;
    const { entryType, queryPath } = getEntryData(entry);
    editAnchorRef.current = entry;
    setInputType("edit", entryType);
    triggerPopover(queryPath, "edit", editAnchorRef);
  });

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging.current) return;
    const entry = (e.target as HTMLElement).closest(".entry");
    if (!entry) return;
    const { entryType, queryPath } = getEntryData(entry);
    editAnchorRef.current = entry;
    setInputType("edit", entryType);
    triggerPopover(queryPath, "edit", editAnchorRef);
  };

  const onClick = (e: React.MouseEvent) => {
    if (e.button !== 0 || isDragging.current || longPressSuccess.current)
      return;
    const entry = (e.target as HTMLElement).closest(".entry");
    if (!entry) return;
    const { queryPath } = getEntryData(entry);
    const clickedAddButton = (e.target as HTMLElement).closest(
      '[data-add-entry="true"]'
    );
    if (clickedAddButton) {
      addAnchorRef.current = clickedAddButton;
      triggerPopover(queryPath, "add", addAnchorRef);
    } else {
      const entryId = getEntryId(queryPath);
      setFolderOpen(entryId, (prev) => !prev);
    }
  };

  const onDragStart = (e: React.DragEvent) => {
    const entry = (e.target as HTMLElement).closest(".entry");
    if (!entry) return;

    isDragging.current = true;
    const preview = document.getElementById("custom-drag-preview");
    e.dataTransfer.setDragImage(preview!, 0, 0);

    const { entryType, entryTitle, queryPath } = getEntryData(entry);
    dragStartQueryPath.current = queryPath;
    setDragCover(entryTitle, entryType === "folder");
  };

  const context = useContext(EntryContext);

  const onDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    isDragging.current = false;
    context!.setState((state) => ({
      dragging: {
        ...state.dragging,
        entryId: -2,
      },
    }));

    if (
      !isDirectParent(
        dragOverQueryPath.current!,
        dragStartQueryPath.current!
      ) &&
      !isDescendant(dragOverQueryPath.current!, dragStartQueryPath.current!)
    ) {
      // moveEntry.mutate({
      //   entry: {
      //     queryPath: dragStartQueryPath.current!,
      //     title,
      //     isFolder,
      //   },
      //   moveToQueryPath: dragOverQueryPath.current,
      // });
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    const entry = (e.target as HTMLElement).closest(".dropEntry");
    if (!entry || dragOverElement.current === entry) return;

    dragOverElement.current = entry;
    const queryPath = getDropAreaData(entry);
    dragOverQueryPath.current = queryPath;
    if (queryPath) {
      context!.setState((state) => ({
        dragging: {
          ...state.dragging,
          entryId: getEntryId(queryPath),
        },
      }));
    }
  };

  return {
    ...longPressHandlers,
    onClick,
    onContextMenu,
    onDragStart,
    onDragEnd,
    onDragOver,
  };
};

export default useEntryInteractions;

function parseJSONAttribute(attribute: string | null): QueryPath | null {
  if (!attribute) return null;
  try {
    return JSON.parse(attribute);
  } catch (error) {
    console.error("Failed to parse JSON attribute:", error);
    return null;
  }
}

function getEntryData(entry: Element): {
  entryTitle: string;
  entryType: InputEntryType;
  queryPath: QueryPath;
} {
  const entryTitle = entry.getAttribute("data-entry-title") ?? undefined;
  const entryType =
    (entry.getAttribute("data-entry-type") as InputEntryType) ?? undefined;
  const queryPath = parseJSONAttribute(entry.getAttribute("data-querypath"));

  if (!entryTitle || !entryType || !queryPath)
    throw new Error("Could not retrieve data-attribute");

  return {
    entryTitle,
    entryType,
    queryPath,
  };
}

function getDropAreaData(entry: Element): QueryPath {
  const queryPath = parseJSONAttribute(entry.getAttribute("data-querypath"));
  if (!queryPath) throw new Error("QueryPath not found in drop area");
  return queryPath;
}

function isDescendant(pathA: QueryPath, pathB: QueryPath): boolean {
  if (pathA.length <= pathB.length) return false;
  return pathB.every((value, index) => value === pathA[index]);
}

function isDirectParent(pathA: QueryPath, pathB: QueryPath): boolean {
  // Check if pathA is exactly one element shorter than pathB
  if (pathA.length + 1 !== pathB.length) return false;

  // Check that every element in pathA matches the corresponding element in pathB
  return pathA.every((value, index) => value === pathB[index]);
}

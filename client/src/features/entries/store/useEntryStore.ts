import { create } from "zustand";
import { FoldersSlice, createFoldersSlice } from "./folders.slice";
import { ModifyEntrySlice, createModifyEntrySlice } from "./modifyEntry.slice";
import { createDraggingEntrySlice, DraggingEntrySlice } from "./dragging.slice";

const useEntryStore = create<
  FoldersSlice & ModifyEntrySlice & DraggingEntrySlice
>((...set) => ({
  ...createFoldersSlice(...set),
  ...createModifyEntrySlice(...set),
  ...createDraggingEntrySlice(...set),
}));

export default useEntryStore;

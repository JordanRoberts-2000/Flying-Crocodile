import { create } from "zustand";
import { FoldersSlice, createFoldersSlice } from "./folders.slice";
import { ModifyEntrySlice, createModifyEntrySlice } from "./modifyEntry.slice";

const useEntryStore = create<FoldersSlice & ModifyEntrySlice>((...set) => ({
  ...createFoldersSlice(...set),
  ...createModifyEntrySlice(...set),
}));

export default useEntryStore;

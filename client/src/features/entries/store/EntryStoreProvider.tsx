import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { FoldersSlice, createFoldersSlice } from "./slices/folders.slice";
import {
  ModifyEntrySlice,
  createModifyEntrySlice,
} from "./slices/modifyEntry.slice";
import {
  createDraggingEntrySlice,
  DraggingEntrySlice,
} from "./slices/dragging.slice";
import { QueryPath } from "../entryTypes";

export type EntryStore = FoldersSlice & ModifyEntrySlice & DraggingEntrySlice;

type Props = PropsWithChildren & {
  queryPath: QueryPath;
};

export const EntryContext = createContext<StoreApi<EntryStore> | undefined>(
  undefined
);

const EntryStoreProvider = ({ children, queryPath }: Props) => {
  const [store] = useState(() =>
    createStore<EntryStore>((...a) => ({
      ...createFoldersSlice(...a),
      ...createModifyEntrySlice(queryPath)(...a),
      ...createDraggingEntrySlice(...a),
    }))
  );
  return (
    <EntryContext.Provider value={store}>{children}</EntryContext.Provider>
  );
};

export default EntryStoreProvider;

export function useEntryStore<T>(selector: (state: EntryStore) => T) {
  const context = useContext(EntryContext);

  if (!context) {
    throw new Error("EntryContext.Provider is missing");
  }

  return useStore(context, selector);
}

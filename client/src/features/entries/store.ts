import { create } from "zustand";
import { InputMode } from "./entryTypes";

type Store = {
  editMode: boolean;
  entryInputMode: InputMode;
  actions: {
    setInputMode: (inputMode: InputMode) => void;
    clearInputMode: () => void;
  };
};

const useEntryStore = create<Store>()((set) => ({
  editMode: false,
  entryInputMode: {
    id: null,
    mode: "add",
    entryType: "folder",
  },
  actions: {
    setInputMode: (inputMode) =>
      set(() => ({
        entryInputMode: {
          id: inputMode.id,
          mode: inputMode.mode,
          entryType: inputMode.entryType,
        },
      })),
    clearInputMode: () =>
      set(({ entryInputMode }) => ({
        entryInputMode: {
          id: null,
          mode: entryInputMode.mode,
          entryType: entryInputMode.entryType,
        },
      })),
  },
}));

export default useEntryStore;

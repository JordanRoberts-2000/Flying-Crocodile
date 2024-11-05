import { StateCreator } from "zustand";
import { InputEntryType, ModifyEntry, QueryPath } from "../entryTypes";

export type ModifyEntrySlice = {
  modifyEntry: {
    queryPath: QueryPath | null;
    inputEntryType: InputEntryType;
    add: ModifyEntry;
    edit: ModifyEntry;
    actions: {
      triggerPopover: (
        queryPath: QueryPath,
        type: "add" | "edit",
        anchorRef: React.MutableRefObject<HTMLElement | null>
      ) => void;
      setPopoverOpen: (type: "add" | "edit", open: boolean) => void;
      setInputActive: (type: "add" | "edit", active: boolean) => void;
      setInputType: (type: InputEntryType) => void;
    };
  };
};

export const createModifyEntrySlice: StateCreator<ModifyEntrySlice> = (
  set
) => ({
  modifyEntry: {
    queryPath: null,
    inputEntryType: "folder",
    add: {
      inputActive: false,
      popoverOpen: false,
      popoverAnchorRef: undefined,
    },
    edit: {
      inputActive: false,
      popoverOpen: false,
      popoverAnchorRef: undefined,
    },
    actions: {
      triggerPopover: (queryPath, type, anchorRef) => {
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            queryPath,
            add: {
              ...state.modifyEntry.add,
              inputActive: false,
              popoverOpen:
                type === "add" ? true : state.modifyEntry.add.popoverOpen,
              popoverAnchorRef:
                type === "add"
                  ? anchorRef
                  : state.modifyEntry.add.popoverAnchorRef,
            },
            edit: {
              ...state.modifyEntry.edit,
              inputActive: false,
              popoverOpen:
                type === "edit" ? true : state.modifyEntry.edit.popoverOpen,
              popoverAnchorRef:
                type === "edit"
                  ? anchorRef
                  : state.modifyEntry.edit.popoverAnchorRef,
            },
          },
        }));
      },

      setPopoverOpen: (type, isOpen) =>
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            add: {
              ...state.modifyEntry.add,
              popoverOpen:
                type === "add" ? isOpen : state.modifyEntry.add.popoverOpen,
            },
            edit: {
              ...state.modifyEntry.edit,
              popoverOpen:
                type === "edit" ? isOpen : state.modifyEntry.edit.popoverOpen,
            },
          },
        })),

      setInputActive: (type, active) => {
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            add: {
              ...state.modifyEntry.add,
              inputActive:
                type === "add" ? active : state.modifyEntry.add.popoverOpen,
            },
            edit: {
              ...state.modifyEntry.edit,
              inputActive:
                type === "edit" ? active : state.modifyEntry.edit.popoverOpen,
            },
          },
        }));
      },

      setInputType: (type) => {
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            inputEntryType: type,
          },
        }));
      },
    },
  },
});

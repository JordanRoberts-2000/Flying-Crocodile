import { StateCreator } from "zustand";
import { InputEntryType, ModifyEntry } from "../entryTypes";

export type ModifyEntrySlice = {
  modifyEntry: {
    add: ModifyEntry;
    edit: ModifyEntry;
    actions: {
      triggerPopover: (
        entryId: number,
        modifyType: "add" | "edit",
        anchorRef: React.MutableRefObject<Element | null>
      ) => void;
      setPopoverOpen: (type: "add" | "edit", open: boolean) => void;
      setInputActive: (type: "add" | "edit", active: boolean) => void;
      setInputType: (
        modifyType: "add" | "edit",
        entryType: InputEntryType
      ) => void;
    };
  };
};

export const createModifyEntrySlice: StateCreator<ModifyEntrySlice> = (
  set
) => ({
  modifyEntry: {
    add: {
      entryId: -2,
      inputEntryType: "folder",
      inputActive: false,
      popoverOpen: false,
      popoverAnchorRef: undefined,
    },
    edit: {
      entryId: -2,
      inputEntryType: "folder",
      inputActive: false,
      popoverOpen: false,
      popoverAnchorRef: undefined,
    },
    actions: {
      triggerPopover: (entryId, modifyType, anchorRef) => {
        set((state) => {
          const updatedEntry = {
            ...state.modifyEntry[modifyType],
            entryId,
            inputEntryType: state.modifyEntry[modifyType].inputEntryType,
            inputActive: false,
            popoverOpen: true,
            popoverAnchorRef: anchorRef,
          };

          return {
            modifyEntry: {
              ...state.modifyEntry,
              [modifyType]: updatedEntry,
            },
          };
        });
      },

      setPopoverOpen: (type, isOpen) =>
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            [type]: {
              ...state.modifyEntry[type],
              popoverOpen: isOpen,
            },
          },
        })),

      setInputActive: (type, active) => {
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            [type]: {
              ...state.modifyEntry[type],
              inputActive: active,
            },
          },
        }));
      },

      setInputType: (modifyType, entryType) => {
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            [modifyType]: {
              ...state.modifyEntry[modifyType],
              modifyType,
              entryType,
            },
          },
        }));
      },
    },
  },
});

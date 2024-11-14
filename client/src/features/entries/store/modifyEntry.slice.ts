import { StateCreator } from "zustand";
import { InputEntryType, ModifyEntry, QueryPath } from "../entryTypes";
import { getEntryId, getEntryParentId } from "../utils/getEntryId";

export type ModifyEntrySlice = {
  modifyEntry: {
    queryPath: QueryPath | null;
    id: {
      parentId: number | null;
      entryId: number;
    };
    add: ModifyEntry;
    edit: ModifyEntry;
    actions: {
      triggerPopover: (
        queryPath: QueryPath,
        modifyType: "add" | "edit",
        anchorRef: React.MutableRefObject<Element | null>
      ) => void;
      setPopoverOpen: (modifyType: "add" | "edit", open: boolean) => void;
      setInputActive: (modifyType: "add" | "edit", active: boolean) => void;
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
    queryPath: null,
    id: {
      entryId: -2,
      parentId: -2,
    },
    add: {
      inputEntryType: "folder",
      inputActive: false,
      popoverOpen: false,
      popoverAnchorRef: undefined,
    },
    edit: {
      inputEntryType: "folder",
      inputActive: false,
      popoverOpen: false,
      popoverAnchorRef: undefined,
    },
    actions: {
      triggerPopover: (queryPath, modifyType, anchorRef) => {
        set((state) => {
          const updatedEntry = {
            ...state.modifyEntry[modifyType],
            inputEntryType: state.modifyEntry[modifyType].inputEntryType,
            inputActive: false,
            popoverOpen: true,
            popoverAnchorRef: anchorRef,
          };

          return {
            modifyEntry: {
              ...state.modifyEntry,
              queryPath,
              id: {
                entryId: getEntryId(queryPath),
                parentId: getEntryParentId(queryPath),
              },
              [modifyType]: updatedEntry,
            },
          };
        });
      },

      setPopoverOpen: (modifyType, isOpen) =>
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            [modifyType]: {
              ...state.modifyEntry[modifyType],
              popoverOpen: isOpen,
            },
          },
        })),

      setInputActive: (modifyType, active) => {
        set((state) => ({
          modifyEntry: {
            ...state.modifyEntry,
            [modifyType]: {
              ...state.modifyEntry[modifyType],
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
              inputEntryType: entryType,
            },
          },
        }));
      },
    },
  },
});

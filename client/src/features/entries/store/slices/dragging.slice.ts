import { StateCreator } from "zustand";

export type DraggingEntrySlice = {
  dragging: {
    entryId: number;
    dragCover: {
      title: string;
      isFolder: boolean;
    };
    actions: {
      setDragCover: (title: string, isFolder: boolean) => void;
    };
  };
};

export const createDraggingEntrySlice: StateCreator<DraggingEntrySlice> = (
  set
) => ({
  dragging: {
    entryId: -2,
    dragCover: {
      title: "",
      isFolder: true,
    },
    actions: {
      setDragCover(title, isFolder) {
        set((state) => ({
          dragging: {
            ...state.dragging,
            dragCover: {
              title,
              isFolder,
            },
          },
        }));
      },
    },
  },
});

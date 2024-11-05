import { StateCreator } from "zustand";

export type FoldersSlice = {
  folders: {
    openFolders: Set<number>;
    actions: {
      toggleFolderOpen: (folderId: number) => void;
    };
  };
  // folderHierarchy: Map<number, number[]>;
  // toggleFolderOpen: (folderId: number) => void;
  // closeFolder: (folderId: number) => void;
  // closeSubfolders: (parentId: number) => void;
  // updateFolderHierarchy: (folders: { id: number; parentId: number | null }[]) => void;
};

export const createFoldersSlice: StateCreator<FoldersSlice> = (_set) => ({
  folders: {
    openFolders: new Set(),
    actions: {
      toggleFolderOpen: (id) => console.log("test", id),
    },
  },
});

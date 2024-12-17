import { CLOSE_SUB_DIRECTORIES } from "@/constants";
import { StateCreator } from "zustand";

export type FoldersSlice = {
  folders: {
    openFolders: Set<number>;
    folderHierarchy: Map<number, number[]>;
    actions: {
      setFolderOpen: (
        folderId: number,
        newState: boolean | ((prev: boolean) => boolean)
      ) => void;
      updateFolderHierarchy: (
        folders: { id: number; parentId: number | null }[]
      ) => void;
    };
  };
};

export const createFoldersSlice: StateCreator<FoldersSlice> = (set) => ({
  folders: {
    openFolders: new Set(),
    folderHierarchy: new Map(),
    actions: {
      setFolderOpen: (folderId, newState) => {
        set((state) => {
          const isOpen = state.folders.openFolders.has(folderId);
          const resolvedState =
            typeof newState === "function" ? newState(isOpen) : newState;

          const newOpenFolders = new Set(state.folders.openFolders);

          if (resolvedState) {
            newOpenFolders.add(folderId);
          } else {
            newOpenFolders.delete(folderId);
            if (CLOSE_SUB_DIRECTORIES) {
              closeSubfoldersRecursively(
                folderId,
                state.folders.folderHierarchy,
                newOpenFolders
              );
            }
          }

          return {
            folders: {
              ...state.folders,
              openFolders: newOpenFolders,
            },
          };
        });
      },

      updateFolderHierarchy: (folders) => {
        set((state) => {
          const newHierarchy = new Map(state.folders.folderHierarchy);

          folders.forEach((folder) => {
            const parentId = folder.parentId;
            if (parentId !== null) {
              if (!newHierarchy.has(parentId)) {
                newHierarchy.set(parentId, []);
              }
              const children = newHierarchy.get(parentId);
              if (children && !children.includes(folder.id)) {
                children.push(folder.id);
              }
            } else {
              if (!newHierarchy.has(folder.id)) {
                newHierarchy.set(folder.id, []);
              }
            }
          });

          return {
            folders: {
              ...state.folders,
              folderHierarchy: newHierarchy,
            },
          };
        });
      },
    },
  },
});

function closeSubfoldersRecursively(
  folderId: number,
  hierarchy: Map<number, number[]>,
  openFolders: Set<number>
) {
  const subfolders = hierarchy.get(folderId) || [];
  subfolders.forEach((subfolderId) => {
    openFolders.delete(subfolderId);
    closeSubfoldersRecursively(subfolderId, hierarchy, openFolders);
  });
}

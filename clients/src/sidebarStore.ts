import { create } from "zustand";

type Store = {
  addCategoryMode: boolean;
};

const useSideBarStore = create<Store>()((_set) => ({
  addCategoryMode: false,
}));

export default useSideBarStore;

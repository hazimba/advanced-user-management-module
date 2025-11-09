import { create } from "zustand";

type UseStore = {
  entity: string;
  setEntity: (en: string) => void;
};

export const useUserStore = create<UseStore>((set) => ({
  entity: "",
  setEntity: (en) => set({ entity: en }),
}));

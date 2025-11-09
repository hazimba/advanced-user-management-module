import { User } from "@/app/types";
import { create } from "zustand";

type UseStore = {
  entity: string;
  setEntity: (en: string) => void;

  userStore: User | User[];
  setUserStore: (u: User | User[]) => void;
};

export const useUserStore = create<UseStore>((set) => ({
  entity: "",
  setEntity: (en) => set({ entity: en }),

  userStore: [],
  setUserStore: (u) => set({ userStore: u }),
}));

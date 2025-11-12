import { create } from "zustand";

interface SelectEntireDataProps {
  isSelectEntireData: boolean;
  setIsSelectEntireData: (arg0: boolean) => void;
}

export const useSelectEntireDataStore = create<SelectEntireDataProps>(
  (set) => ({
    isSelectEntireData: false,
    setIsSelectEntireData: (val: boolean) => set({ isSelectEntireData: val }),
  })
);

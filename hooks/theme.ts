import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  selectedTheme: "light" | "dark" | "system";
  setSelectedTheme: (theme: "light" | "dark" | "system") => void;
}

// no require as shadcn theme also store cache in localstorage
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      selectedTheme: "system",
      setSelectedTheme: (theme) => set({ selectedTheme: theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);

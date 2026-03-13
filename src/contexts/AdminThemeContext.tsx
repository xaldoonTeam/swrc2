import { createContext, useContext } from "react";

const STORAGE_KEY = "swrc_admin_theme";

export type AdminThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleTheme: () => void;
};

export const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function getStoredTheme(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light") return false;
    if (v === "dark") return true;
  } catch {
    // ignore
  }
  return true;
}

export function setStoredTheme(dark: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // ignore
  }
}

export function useAdminTheme(): AdminThemeContextValue {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    return {
      darkMode: true,
      setDarkMode: () => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}

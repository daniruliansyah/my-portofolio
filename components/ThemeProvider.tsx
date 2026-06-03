"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "viscabarca";

const THEMES: Theme[] = ["light", "dark", "viscabarca"];
const STORAGE_KEY = "porto-theme";

interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  cycleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // On mount: read persisted theme from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && THEMES.includes(stored)) setTheme(stored);
    } catch {}
  }, []);

  // Sync <html> class + localStorage whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    THEMES.forEach((t) => root.classList.remove(t));
    root.classList.add(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  function cycleTheme() {
    setTheme((prev) => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length]);
  }

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "family_quiz_theme";
const PLAYER_STORAGE_KEY = "family_quiz_player";
const THEME_CHANGED_EVENT = "family-quiz-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (isTheme(savedTheme)) {
    return savedTheme;
  }

  try {
    const savedPlayer = window.localStorage.getItem(PLAYER_STORAGE_KEY);
    const parsed = savedPlayer ? JSON.parse(savedPlayer) : null;

    if (isTheme(parsed?.theme)) {
      return parsed.theme;
    }
  } catch {
    return "dark";
  }

  return "dark";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

function persistTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    persistTheme(nextTheme);
    window.dispatchEvent(
      new CustomEvent(THEME_CHANGED_EVENT, { detail: nextTheme })
    );
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);
      persistTheme(nextTheme);
      window.dispatchEvent(
        new CustomEvent(THEME_CHANGED_EVENT, { detail: nextTheme })
      );

      return nextTheme;
    });
  }, []);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    applyTheme(storedTheme);
    persistTheme(storedTheme);
    const syncTimer = window.setTimeout(() => {
      setThemeState(storedTheme);
    }, 0);

    function handleStorage(event: StorageEvent) {
      if (
        event.key !== THEME_STORAGE_KEY &&
        event.key !== PLAYER_STORAGE_KEY
      ) {
        return;
      }

      const nextTheme = readStoredTheme();
      setThemeState(nextTheme);
      applyTheme(nextTheme);
    }

    function handleThemeChange(event: Event) {
      const nextTheme = (event as CustomEvent<Theme>).detail;

      if (!isTheme(nextTheme)) return;

      setThemeState(nextTheme);
      applyTheme(nextTheme);
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(THEME_CHANGED_EVENT, handleThemeChange);

    return () => {
      window.clearTimeout(syncTimer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(THEME_CHANGED_EVENT, handleThemeChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return value;
}

export { THEME_CHANGED_EVENT, THEME_STORAGE_KEY };

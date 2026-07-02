"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/components/ThemeProvider";

type Props = {
  onThemeChange?: (theme: Theme) => void;
};

export default function ThemeToggle({ onThemeChange }: Props) {
  const { theme, setTheme } = useTheme();

  function selectTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    onThemeChange?.(nextTheme);
  }

  return (
    <div className="grid grid-cols-2 gap-2 rounded-[28px] border border-violet-200/70 bg-white/70 p-2 shadow-inner shadow-violet-200/50 backdrop-blur-xl transition dark:border-white/10 dark:bg-white/10 dark:shadow-black/10">
      <button
        type="button"
        onClick={() => selectTheme("light")}
        aria-pressed={theme === "light"}
        className={`flex min-h-14 items-center justify-center gap-2 rounded-3xl px-3 text-sm font-black transition duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:min-h-16 sm:text-base ${
          theme === "light"
            ? "bg-white text-violet-700 shadow-lg shadow-violet-200/80"
            : "text-slate-500 hover:bg-white/70 dark:text-white/60 dark:hover:bg-white/10"
        }`}
      >
        <Sun size={19} strokeWidth={3} aria-hidden="true" />
        <span>Light Mode</span>
      </button>

      <button
        type="button"
        onClick={() => selectTheme("dark")}
        aria-pressed={theme === "dark"}
        className={`flex min-h-14 items-center justify-center gap-2 rounded-3xl px-3 text-sm font-black transition duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:min-h-16 sm:text-base ${
          theme === "dark"
            ? "bg-slate-950 text-cyan-100 shadow-lg shadow-slate-950/30 dark:bg-gradient-to-br dark:from-cyan-300 dark:to-fuchsia-400 dark:text-slate-950 dark:shadow-cyan-500/25"
            : "text-slate-500 hover:bg-white/70 dark:text-white/60 dark:hover:bg-white/10"
        }`}
      >
        <Moon size={19} strokeWidth={3} aria-hidden="true" />
        <span>Dark Mode</span>
      </button>
    </div>
  );
}

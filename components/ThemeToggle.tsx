"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

function FootballIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      {/* Center pentagon */}
      <polygon points="12,7.5 15,10 14,13.5 10,13.5 9,10" />
      {/* Seams from each pentagon vertex to the circle edge */}
      <line x1="12"   y1="7.5"  x2="12"   y2="2"   />
      <line x1="15"   y1="10"   x2="20.5" y2="8.5"  />
      <line x1="14"   y1="13.5" x2="18.5" y2="18"   />
      <line x1="10"   y1="13.5" x2="5.5"  y2="18"   />
      <line x1="9"    y1="10"   x2="3.5"  y2="8.5"  />
    </svg>
  );
}

const NEXT_LABEL: Record<string, string> = {
  light:      "Switch to Dark Mode",
  dark:       "Switch to ViscaBarca Mode",
  viscabarca: "Switch to Light Mode",
};

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      onClick={cycleTheme}
      aria-label={NEXT_LABEL[theme]}
      title={NEXT_LABEL[theme]}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 bg-th-soft text-th-ink hover:text-th-accent border border-th-border hover:border-th-accent"
    >
      {theme === "light"      && <Sun size={17} />}
      {theme === "dark"       && <Moon size={17} />}
      {theme === "viscabarca" && <FootballIcon size={17} />}
    </button>
  );
}

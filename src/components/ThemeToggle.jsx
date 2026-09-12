"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full bg-neutral-800/40 animate-pulse ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark / Light Theme"
      id="theme-toggle-btn"
      className={`relative p-2 rounded-full transition-all duration-300 backdrop-blur-md border ${
        theme === "dark"
          ? "bg-neutral-900/80 border-neutral-700 text-amber-400 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.25)]"
          : "bg-white/80 border-neutral-200 text-indigo-600 hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(79,70,229,0.2)]"
      } ${className}`}
    >
      {theme === "dark" ? (
        <FiSun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <FiMoon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

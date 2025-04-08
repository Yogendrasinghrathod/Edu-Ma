import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

function DarkMode() {
  // State to track the current theme
  const [theme, setTheme] = useState(() => {
    // Check if theme exists in localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // Effect to apply theme changes
  useEffect(() => {
    // Update localStorage
    localStorage.setItem("theme", theme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Toggle between light/dark modes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button 
      onClick={toggleTheme}
      className="relative w-12 h-6 flex items-center rounded-full p-1 bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Track */}
      <span className="absolute inset-0 rounded-full transition-colors duration-300 bg-slate-200 dark:bg-slate-700"></span>
      
      {/* Toggle (Circle) */}
      <span className={`block w-4 h-4 rounded-full transform transition-transform duration-300 shadow-sm bg-white ${theme === "dark" ? "translate-x-6" : "translate-x-0"} flex items-center justify-center`}>
        <Sun className="h-3 w-3 text-amber-500 absolute transition-opacity duration-300 dark:opacity-0" />
        <Moon className="h-3 w-3 text-indigo-400 absolute transition-opacity duration-300 opacity-0 dark:opacity-100" />
      </span>
    </button>
  );
}

export default DarkMode;
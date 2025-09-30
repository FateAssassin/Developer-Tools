import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Footer() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <footer className="bg-gray-300/40 dark:bg-gray-800/40 text-gray-800 dark:text-gray-200 text-center py-4">
      <a href="https://www.github.com/fateassassin">GitHub</a>
      <span className="ml-2">&nbsp;|</span>
      <button onClick={toggleTheme} className="ml-3">
        <i className={`bi bi-${theme === "light" ? "moon text-gray-500" : "sun text-yellow-200"} cursor-pointer`}></i>
      </button>
    </footer>
  );
}
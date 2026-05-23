import { HiMoon, HiSun } from "react-icons/hi";
import { createPortal } from "react-dom";
import { computeToggleAnchor } from "../lib/theme-transition";
import { useTheme } from "../contexts/theme";

function ToggleIcon({ theme }: { theme: "dark" | "light" }) {
  return theme === "dark" ? <HiSun size={20} /> : <HiMoon size={20} />;
}

export function ThemeToggle() {
  const { theme, toggleTheme, themeTransition } = useTheme();
  const isAnimating = themeTransition !== null;
  const displayTheme = themeTransition?.to ?? theme;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;

    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({
      x: event.clientX,
      y: event.clientY,
      anchor: computeToggleAnchor(rect),
    });
  };

  const buttonClassName =
    "theme-toggle glass-button flex h-10 w-10 items-center justify-center rounded-full text-indigo-500 transition-colors hover:text-indigo-400 dark:text-indigo-300 dark:hover:text-indigo-200";

  const pinnedToggle =
    isAnimating &&
    createPortal(
      <div
        className="theme-toggle-pin"
        style={{
          left: themeTransition.anchor.centerX,
          top: themeTransition.anchor.centerY,
          width: themeTransition.anchor.pinRadius * 2,
          height: themeTransition.anchor.pinRadius * 2,
        }}
      >
        <button
          type="button"
          className={buttonClassName}
          aria-label={
            displayTheme === "dark"
              ? "Ativar tema claro"
              : "Ativar tema escuro"
          }
          title={displayTheme === "dark" ? "Tema claro" : "Tema escuro"}
          tabIndex={-1}
        >
          <ToggleIcon theme={displayTheme} />
        </button>
      </div>,
      document.body
    );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`${buttonClassName}${isAnimating ? " invisible" : ""}`}
        aria-label={
          displayTheme === "dark"
            ? "Ativar tema claro"
            : "Ativar tema escuro"
        }
        title={displayTheme === "dark" ? "Tema claro" : "Tema escuro"}
        aria-hidden={isAnimating}
        tabIndex={isAnimating ? -1 : 0}
      >
        <ToggleIcon theme={displayTheme} />
      </button>
      {pinnedToggle}
    </>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ThemeTransitionPhase } from "../components/theme-transition-overlay";
import {
  applyThemeToDocument,
  computeRevealRadius,
  prefersReducedMotion,
  runThemeTransitionAnimation,
  ThemeTransitionOrigin,
  type Theme,
} from "../lib/theme-transition";

export type { Theme };

type ThemeContextValue = {
  theme: Theme;
  themeTransition: ThemeTransitionPhase | null;
  setTheme: (theme: Theme, origin?: ThemeTransitionOrigin) => void;
  toggleTheme: (origin?: ThemeTransitionOrigin) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("currency-converter-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [transition, setTransition] = useState<ThemeTransitionPhase | null>(
    null
  );
  const themeRef = useRef(theme);
  const transitionIdRef = useRef(0);

  themeRef.current = theme;

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (transition) {
      document.body.classList.add("theme-transition-active");
      return () => document.body.classList.remove("theme-transition-active");
    }
  }, [transition]);

  const setTheme = useCallback(
    (next: Theme, origin?: ThemeTransitionOrigin) => {
      if (next === themeRef.current) return;

      const run = async () => {
        const transitionId = ++transitionIdRef.current;

        if (origin && !prefersReducedMotion()) {
          const radius = computeRevealRadius(origin.x, origin.y);

          applyThemeToDocument(next);
          setThemeState(next);

          setTransition({
            to: next,
            x: origin.x,
            y: origin.y,
            radius,
            scale: 0,
            anchor: origin.anchor,
          });

          await runThemeTransitionAnimation(origin, (scale) => {
            if (transitionId !== transitionIdRef.current) return;
            setTransition({
              to: next,
              x: origin.x,
              y: origin.y,
              radius,
              scale,
              anchor: origin.anchor,
            });
          });

          if (transitionId !== transitionIdRef.current) return;

          setTransition(null);
          return;
        }

        applyThemeToDocument(next);
        setThemeState(next);
      };

      void run();
    },
    []
  );

  const toggleTheme = useCallback((origin?: ThemeTransitionOrigin) => {
    const current = themeRef.current;
    const next: Theme = current === "dark" ? "light" : "dark";
    setTheme(next, origin);
  }, [setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, themeTransition: transition, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

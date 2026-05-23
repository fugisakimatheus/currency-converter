export type Theme = "dark" | "light";

const STORAGE_KEY = "currency-converter-theme";
export const THEME_TRANSITION_DURATION_MS = 900;

export type ThemeTransitionAnchor = {
  centerX: number;
  centerY: number;
  pinRadius: number;
};

export type ThemeTransitionOrigin = {
  x: number;
  y: number;
  anchor: ThemeTransitionAnchor;
};

export function computeToggleAnchor(rect: DOMRect): ThemeTransitionAnchor {
  return {
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    pinRadius: Math.max(rect.width, rect.height) / 2 + 12,
  };
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function computeRevealRadius(x: number, y: number): number {
  const { innerWidth: w, innerHeight: h } = window;
  const maxX = Math.max(x, w - x);
  const maxY = Math.max(y, h - y);
  return Math.hypot(maxX, maxY) * 1.1;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  localStorage.setItem(STORAGE_KEY, theme);
}

export function runThemeTransitionAnimation(
  origin: ThemeTransitionOrigin,
  onFrame: (scale: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / THEME_TRANSITION_DURATION_MS, 1);
      onFrame(easeOutCubic(progress));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      resolve();
    };

    frameId = requestAnimationFrame(tick);
  });
}

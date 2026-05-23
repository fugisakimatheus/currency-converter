import { createPortal } from "react-dom";
import type { Theme, ThemeTransitionAnchor } from "../lib/theme-transition";

export type ThemeTransitionPhase = {
  to: Theme;
  x: number;
  y: number;
  radius: number;
  scale: number;
  anchor: ThemeTransitionAnchor;
};

const THEME_SURFACE: Record<Theme, string> = {
  light: "#f1f5f9",
  dark: "#020617",
};

type ThemeTransitionOverlayProps = {
  phase: ThemeTransitionPhase | null;
};

export function ThemeTransitionOverlay({ phase }: ThemeTransitionOverlayProps) {
  if (!phase) return null;

  const { to, x, y, radius, scale } = phase;
  const diameter = radius * 2;

  return createPortal(
    <div className="theme-transition-layer" aria-hidden>
      <div
        className="theme-transition-circle"
        style={{
          left: x - radius,
          top: y - radius,
          width: diameter,
          height: diameter,
          backgroundColor: THEME_SURFACE[to],
          transform: `scale(${scale})`,
        }}
      />
    </div>,
    document.body
  );
}

# Currency Converter

**Language:** English · [Português](README.md)

Web app for real-time currency conversion, with a 30-day exchange-rate chart and light/dark theme support—including a circular reveal animation from the theme toggle button.

## Features

- Convert among dozens of currencies supported by the [Frankfurter](https://www.frankfurter.app/) API
- Live rate and converted amount when changing currencies or input value
- Quick swap of source/target currency pair
- Area chart for the last 30 days (ApexCharts)
- `localStorage` cache to cut down repeat API calls
- Persisted light/dark theme with animated transition
- Responsive layout (mobile and desktop) with a glassmorphism UI

## Stack

| Layer | Technology |
|-------|------------|
| UI | React 18, TypeScript |
| Build | Vite 4 |
| Styling | Tailwind CSS 3, Sass |
| Charts | ApexCharts (`react-apexcharts`) |
| Icons | `react-icons` |
| API | Frankfurter (same-origin proxy) |

## Project structure

```
currency-converter/
├── index.html              # HTML shell + anti-flash theme script
├── vite.config.ts          # Dev/preview + /api/frankfurter proxy
├── vercel.json             # API rewrite in production (Vercel)
├── tailwind.config.cjs
├── postcss.config.cjs
└── src/
    ├── main.tsx            # React bootstrap + providers
    ├── App.tsx             # Main layout
    ├── index.scss          # Global and component styles
    ├── components/
    │   ├── converter-fields.tsx
    │   ├── exchange-chart.tsx
    │   ├── input.tsx              # CurrencyInput
    │   ├── theme-toggle.tsx
    │   └── theme-transition-overlay.tsx
    ├── contexts/
    │   ├── currency.tsx           # Converter state
    │   └── theme.tsx              # Theme + animation
    ├── hooks/
    │   └── use-currency-pair.ts   # Fetch, cache, chart data
    ├── lib/
    │   ├── format.ts
    │   └── theme-transition.ts
    └── services/
        ├── exchange-rates.ts
        └── exchange-rates-cache.ts
```

### Data flow

1. **`CurrencyProvider`** holds currencies, input amount, and converted amount.
2. **`useCurrencyPair`** fetches the latest rate and historical series, with local cache.
3. **`ThemeProvider`** manages theme, reveal animation, and `<html>` class toggling.
4. **`App`** composes the converter, chart, and theme transition overlay.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended)
- npm (or compatible package manager)

## Setup and run

```bash
# Clone and enter the project directory
cd currency-converter

# Install dependencies
npm install

# Development server (default port 5000)
npm run dev
```

Optional `APP_PORT` in `.env` overrides the Vite port.

```bash
# Production build
npm run build

# Preview the production build
npm run preview
```

## API and proxy

Requests go through `/api/frankfurter`, rewritten to `https://api.frankfurter.app` to avoid CORS:

- **Development / preview:** proxy in `vite.config.ts`
- **Production (Vercel):** `rewrites` in `vercel.json`

Without this proxy (or an equivalent rewrite), the browser may block direct API calls.

## Light / dark theme

- Preference stored in `localStorage` (`currency-converter-theme`)
- Inline script in `index.html` prevents flash on first paint
- Theme toggle triggers a circular expand animation from the click point; the toggle stays visible above the overlay
- Honors `prefers-reduced-motion: reduce` (instant switch, no animation)

## Deploy

The repo includes [Vercel](https://vercel.com/) config via `vercel.json`. After deploy, ensure the `/api/frankfurter` rewrite is active so rates load correctly.

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | `tsc` + Vite build to `dist/` |
| `npm run preview` | Serve the build locally |

---

Portuguese documentation: [README.md](README.md)

# StellarView

An interactive solar system visualization built with React, TypeScript, and SVG. Watch the eight planets orbit the Sun in real time, click any world to inspect its vital statistics, and control the simulation speed.

![Vite](https://img.shields.io/badge/vite-6-blueviolet) ![React](https://img.shields.io/badge/react-18-blue) ![TypeScript](https://img.shields.io/badge/typescript-5-blue) ![Tailwind](https://img.shields.io/badge/tailwind-4-cyan)

## Features

- **Animated orbital simulation** — all eight planets orbit the Sun with proportional periods
- **Interactive info panel** — click any planet or the Sun to view diameter, distance, orbital period, temperature, moon count, and a field note
- **Playback controls** — play/pause, adjustable speed presets (0.5× to 25×), and a reset button
- **Mission clock** — tracks elapsed simulation time in Earth days or years
- **Starfield backdrop** — layered parallax stars with twinkle animation, faint nebulae, and occasional meteors
- **Asteroid belt** — 160 particles orbiting between Mars and Jupiter, synced to the simulation clock
- **Planet details** — Saturn's rings, Jupiter's Great Red Spot and cloud bands, Uranus's tilted ring, Earth's Moon, and moons for the gas/ice giants
- **Orbit trails** — short motion trails behind each planet showing direction of travel
- **Keyboard shortcuts** — Space (play/pause), 1–8 (select planet), 0 (Sun), ←/→ (speed), O (toggle orbits), L (toggle labels), Esc (deselect)
- **Accessibility** — respects `prefers-reduced-motion`, ARIA labels on interactive elements, keyboard-navigable
- **Responsive** — scales to any viewport via SVG `viewBox`

## Tech Stack

- **React 18** with TypeScript
- **Vite 6** for dev server and builds
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin)
- **SVG** for the orbital map (no canvas/WebGL for planets)
- **Canvas** for the starfield background layer
- **Framer Motion** (available, used minimally)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Vite will serve the app at `http://localhost:5173`.

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start Vite dev server          |
| `npm run build`    | Production build to `dist/`    |
| `npm run typecheck`| Run TypeScript type checking   |

## Project Structure

```
src/
├── App.tsx                  # Root layout, simulation clock, keyboard bindings
├── main.tsx                 # Entry point
├── index.css                # Global styles
├── components/
│   ├── SolarSystem.tsx      # SVG orbital map (Sun, planets, rings, moons, trails)
│   ├── Controls.tsx         # Playback bar (play/pause, speed, toggles, reset)
│   ├── InfoPanel.tsx        # Slide-in detail panel for selected body
│   └── Starfield.tsx        # Canvas starfield, nebulae, asteroid belt, meteors
├── data/
│   └── planets.ts           # Planet/Sun data, orbital parameters, display config
└── hooks/
    └── usePrefersReducedMotion.ts
```

## Current Status

The core visualization is complete and functional:

- All eight planets animate with correct relative orbital periods
- Planet selection, hover chips, and the info panel work end-to-end
- Controls (play/pause, speed, orbit/label toggles, reset) are wired up
- Starfield, asteroid belt, and meteors render on the canvas layer
- Keyboard navigation is fully implemented
- The app builds cleanly with no type errors

## License

MIT

import { useEffect, useRef, useState } from "react";
import Starfield from "./components/Starfield";
import SolarSystem from "./components/SolarSystem";
import InfoPanel from "./components/InfoPanel";
import Controls from "./components/Controls";
import { BASE_DAYS_PER_SEC, PLANETS, SPEED_PRESETS, SUN } from "./data/planets";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

export default function App() {
  const reduced = usePrefersReducedMotion();

  // honor prefers-reduced-motion: the orrery starts at rest, ready to be played
  const [playing, setPlaying] = useState<boolean>(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [speed, setSpeed] = useState(1);
  const [simDays, setSimDays] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const simRef = useRef(0);
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  playingRef.current = playing;
  speedRef.current = speed;

  // simulation clock — the single heartbeat driving every orbit
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (playingRef.current) {
        simRef.current += dt * BASE_DAYS_PER_SEC * speedRef.current;
        setSimDays(simRef.current);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reset = () => {
    simRef.current = 0;
    setSimDays(0);
  };

  // keyboard transport
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        setSpeed((s) => SPEED_PRESETS[Math.min(SPEED_PRESETS.indexOf(s) + 1, SPEED_PRESETS.length - 1)]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        setSpeed((s) => SPEED_PRESETS[Math.max(SPEED_PRESETS.indexOf(s) - 1, 0)]);
      } else if (/^[1-8]$/.test(e.key)) {
        setSelectedId(PLANETS[Number(e.key) - 1].id);
      } else if (e.key === "0") {
        setSelectedId("sun");
      } else if (e.key.toLowerCase() === "o") {
        setShowOrbits((v) => !v);
      } else if (e.key.toLowerCase() === "l") {
        setShowLabels((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedBody = PLANETS.find((p) => p.id === selectedId) ?? (selectedId === "sun" ? SUN : null);

  // mission clock readouts
  const days = Math.floor(simDays);
  const years = simDays / 365.25;
  const bigClock = days < 365250 ? days.toLocaleString("en-US") : `${Math.floor(years).toLocaleString("en-US")}`;
  const bigUnit = days < 365250 ? "Earth days" : "Earth years";
  const subClock =
    years >= 1 ? `≈ ${years.toFixed(2)} yr elapsed` : `${Math.floor(simDays * 24).toLocaleString("en-US")} h elapsed`;

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-space-950 font-body text-slate-200">
      {/* layered deep-space backdrop */}
      <Starfield simRef={simRef} reduced={reduced} />
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-space-950/90 via-space-950/35 to-transparent"
        aria-hidden="true"
      />

      {/* the orrery itself */}
      <SolarSystem
        simDays={simDays}
        selectedId={selectedId}
        hoveredId={hoveredId}
        showOrbits={showOrbits}
        showLabels={showLabels}
        onSelect={setSelectedId}
        onHover={setHoveredId}
      />

      {/* masthead */}
      <header className="pointer-events-none absolute left-5 top-5 z-20 sm:left-7 sm:top-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-[3px] rounded-full bg-gradient-to-b from-ember-400 via-ember-500/60 to-transparent" />
          <div>
            <h1 className="font-display text-lg font-extrabold leading-none tracking-[0.3em] text-slate-100 sm:text-xl">
              ORRERY<span className="text-ember-400">·08</span>
            </h1>
            <p className="mt-1.5 text-[9.5px] font-medium uppercase tracking-[0.3em] text-slate-400">
              Interactive atlas of the Solar System
            </p>
          </div>
        </div>
      </header>

      {/* mission clock */}
      <div className="pointer-events-none absolute right-5 top-5 z-20 text-right sm:right-7 sm:top-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-500">Mission clock</p>
        <p className="mt-0.5 font-display text-xl font-bold leading-none text-ion-200 tabular-nums sm:text-2xl">
          {bigClock}
          <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ion-400/80">{bigUnit}</span>
        </p>
        <p className="mt-1 text-[9.5px] uppercase tracking-[0.18em] text-slate-500 tabular-nums">
          {subClock} · rate {speed}×
        </p>
      </div>

      {/* invitation — only before a world is chosen */}
      {!selectedBody && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center px-4">
          <div className="drift-up flex items-center gap-2.5 rounded-full border border-white/10 bg-space-900/85 px-4 py-2 backdrop-blur-sm">
            <span className="blink-dot h-1.5 w-1.5 shrink-0 rounded-full bg-ember-400" />
            <span className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-slate-300">
              Click any world — or the Sun — to inspect it
            </span>
          </div>
        </div>
      )}

      <InfoPanel body={selectedBody} onClose={() => setSelectedId(null)} />

      <Controls
        playing={playing}
        speed={speed}
        showOrbits={showOrbits}
        showLabels={showLabels}
        onTogglePlay={() => setPlaying((p) => !p)}
        onSpeedChange={setSpeed}
        onToggleOrbits={() => setShowOrbits((v) => !v)}
        onToggleLabels={() => setShowLabels((v) => !v)}
        onReset={reset}
      />
    </div>
  );
}

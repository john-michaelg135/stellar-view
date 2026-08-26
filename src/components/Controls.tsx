import { useCallback, useEffect, useRef, useState } from "react";
import { SPEED_PRESETS } from "../data/planets";

interface Props {
  playing: boolean;
  rewinding: boolean;
  speed: number;
  showOrbits: boolean;
  showLabels: boolean;
  onTogglePlay: () => void;
  onToggleRewind: () => void;
  onSpeedChange: (s: number) => void;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
  onReset: () => void;
}

function Divider() {
  return <span className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden="true" />;
}

const IDLE_TIMEOUT = 3000; // ms before auto-collapse

export default function Controls({
  playing,
  rewinding,
  speed,
  showOrbits,
  showLabels,
  onTogglePlay,
  onToggleRewind,
  onSpeedChange,
  onToggleOrbits,
  onToggleLabels,
  onReset,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const resetTimer = useCallback(() => {
    if (pinned) return;
    setCollapsed(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCollapsed(true), IDLE_TIMEOUT);
  }, [pinned]);

  // start the idle timer on mount
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  // any pointer movement near the bottom reveals the dock
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const threshold = window.innerHeight - 120;
      if (e.clientY >= threshold) {
        resetTimer();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [resetTimer]);

  // reveal on any keyboard shortcut (space, arrows, etc.)
  useEffect(() => {
    const onKey = () => resetTimer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetTimer]);

  const handleInteraction = () => {
    resetTimer();
  };

  const togglePin = () => {
    setPinned((p) => {
      if (!p) {
        // pinning — clear the collapse timer and show
        if (timerRef.current) clearTimeout(timerRef.current);
        setCollapsed(false);
      } else {
        // unpinning — restart idle timer
        resetTimer();
      }
      return !p;
    });
  };

  return (
    <>
      {/* collapsed peek indicator — fixed independently so it never gets clipped */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center transition-all duration-500 ease-out sm:bottom-5 ${
          collapsed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div
          className={`pointer-events-auto flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-space-900/80 px-4 py-1.5 backdrop-blur-sm transition-colors hover:border-white/20 ${
            collapsed ? "" : "pointer-events-none"
          }`}
          onClick={() => { setCollapsed(false); resetTimer(); }}
          role="button"
          aria-label="Show controls"
        >
          <span className={`h-2 w-2 rounded-full ${playing ? "bg-ember-400 animate-pulse" : rewinding ? "bg-ion-400 animate-pulse" : "bg-slate-500"}`} />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-300">
            {rewinding ? "Rewinding" : playing ? "Playing" : "Paused"} · {speed}×
          </span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="ml-1 text-slate-500" aria-hidden="true">
            <path d="M1 5l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* main dock */}
      <div
        ref={dockRef}
        onPointerEnter={handleInteraction}
        onClick={handleInteraction}
        className={`pointer-events-none fixed inset-x-0 bottom-4 z-30 flex flex-col items-center gap-2.5 px-3 transition-all duration-500 ease-out sm:bottom-5 ${
          collapsed ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >

      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-space-900/90 px-4 py-3 shadow-[0_16px_60px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-5">
        {/* pin toggle */}
        <button
          onClick={togglePin}
          aria-label={pinned ? "Unpin controls (auto-hide)" : "Pin controls (always visible)"}
          title={pinned ? "Unpin (auto-hide)" : "Pin (always visible)"}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
            pinned
              ? "border-ember-400/50 bg-ember-400/10 text-ember-300"
              : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M9.828 1.172a2 2 0 0 1 2.828 0l2.172 2.172a2 2 0 0 1 0 2.828l-3.586 3.586-.707.707L9.12 11.88l-3.535 3.535a.5.5 0 0 1-.707-.707l3.535-3.535-1.414-1.414L3.464 13.3a.5.5 0 0 1-.707-.707L6.293 9.06 4.879 7.646l-.707.707L.636 11.89a.5.5 0 0 1-.707-.707l3.536-3.536.707-.707L9.828 1.172z" />
          </svg>
        </button>

        <Divider />

        {/* rewind */}
        <button
          onClick={onToggleRewind}
          aria-label={rewinding ? "Stop rewinding" : "Rewind simulation"}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
            rewinding
              ? "bg-ion-400 text-space-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-ion-300"
              : "border border-ion-400/60 bg-ion-400/10 text-ion-300 hover:bg-ion-400/20"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8.5 1.8a1 1 0 0 0-1.52-.86l-5.5 6.2a1 1 0 0 0 0 1.72l5.5 6.2A1 1 0 0 0 8.5 14.2V1.8z" />
            <path d="M15 1.8a1 1 0 0 0-1.52-.86l-5.5 6.2a1 1 0 0 0 0 1.72l5.5 6.2A1 1 0 0 0 15 14.2V1.8z" />
          </svg>
        </button>

        {/* play / pause */}
        <button
          onClick={onTogglePlay}
          aria-label={playing ? "Pause simulation" : "Play simulation"}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
            playing
              ? "bg-ember-400 text-space-950 shadow-[0_0_24px_rgba(251,191,36,0.45)] hover:bg-ember-300"
              : "border border-ember-400/60 bg-ember-400/10 text-ember-300 hover:bg-ember-400/20"
          }`}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="2.5" y="1.5" width="4" height="13" rx="1.2" />
              <rect x="9.5" y="1.5" width="4" height="13" rx="1.2" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 1.8a1 1 0 0 1 1.52-.86l9 6.2a1 1 0 0 1 0 1.72l-9 6.2A1 1 0 0 1 4 14.2V1.8z" />
            </svg>
          )}
        </button>

        <Divider />

        {/* speed presets */}
        <div className="flex items-center gap-1.5">
          <span className="mr-1 hidden text-[9px] font-semibold uppercase tracking-[0.26em] text-slate-500 sm:block">
            Velocity
          </span>
          {SPEED_PRESETS.map((s) => {
            const active = s === speed;
            return (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                aria-pressed={active}
                aria-label={`Set speed ${s}x`}
                className={`rounded-md border px-2 py-1 font-display text-[11px] font-semibold transition-colors duration-250 ${
                  active
                    ? "border-ion-400/60 bg-ion-400/10 text-ion-300 shadow-[0_0_14px_rgba(34,211,238,0.25)]"
                    : "border-transparent text-slate-400 hover:border-white/15 hover:text-slate-100"
                }`}
              >
                {s}×
              </button>
            );
          })}
        </div>

        <Divider />

        {/* toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleOrbits}
            aria-pressed={showOrbits}
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300 transition-opacity hover:opacity-80"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${showOrbits ? "bg-ember-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-slate-600"}`} />
            Orbits
          </button>
          <button
            onClick={onToggleLabels}
            aria-pressed={showLabels}
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300 transition-opacity hover:opacity-80"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${showLabels ? "bg-ember-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-slate-600"}`} />
            Labels
          </button>
        </div>

        <Divider />

        {/* reset */}
        <button
          onClick={onReset}
          aria-label="Reset simulation clock"
          title="Reset clock"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors duration-300 hover:border-ember-400/50 hover:text-ember-300"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M12 7a5 5 0 1 1-1.7-3.75M12 1.5v2.8H9.2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className={`pointer-events-none hidden text-[9.5px] font-medium uppercase tracking-[0.26em] text-slate-500 transition-opacity duration-300 md:block ${collapsed ? "opacity-0" : "opacity-100"}`}>
        Space — play/pause · R — rewind · 1–8 — worlds · ← → — velocity · O — orbits · Esc — close
      </p>
    </div>
    </>
  );
}

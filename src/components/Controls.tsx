import { SPEED_PRESETS } from "../data/planets";

interface Props {
  playing: boolean;
  speed: number;
  showOrbits: boolean;
  showLabels: boolean;
  onTogglePlay: () => void;
  onSpeedChange: (s: number) => void;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
  onReset: () => void;
}

function Divider() {
  return <span className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden="true" />;
}

export default function Controls({
  playing,
  speed,
  showOrbits,
  showLabels,
  onTogglePlay,
  onSpeedChange,
  onToggleOrbits,
  onToggleLabels,
  onReset,
}: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex flex-col items-center gap-2.5 px-3 sm:bottom-5">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-space-900/90 px-4 py-3 shadow-[0_16px_60px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-5">
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

      <p className="pointer-events-none hidden text-[9.5px] font-medium uppercase tracking-[0.26em] text-slate-500 md:block">
        Space — play/pause · 1–8 — worlds · ← → — velocity · O — orbits · Esc — close
      </p>
    </div>
  );
}

import { useRef } from "react";
import type { BodyData } from "../data/planets";

interface Props {
  body: BodyData | null;
  onClose: () => void;
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md border border-white/[0.07] bg-white/[0.035] px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-1 font-display text-[13.5px] font-semibold leading-snug text-slate-100" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  );
}

export default function InfoPanel({ body, onClose }: Props) {
  const lastRef = useRef<BodyData | null>(null);
  if (body) lastRef.current = body;
  const shown = body ?? lastRef.current;
  const open = body !== null;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-30 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:w-[352px] sm:-translate-y-1/2">
      <aside
        aria-hidden={!open}
        className={`overflow-hidden rounded-xl border border-white/10 bg-space-900/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md transition-transform duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "translate-y-0 sm:translate-x-0 pointer-events-auto"
            : "translate-y-[130%] sm:translate-y-0 sm:translate-x-[130%] pointer-events-none"
        }`}
        role="dialog"
        aria-label={shown ? `${shown.name} details` : "Planet details"}
      >
        {shown && (
          <div key={shown.id} className={open ? "drift-up" : undefined}>
            {/* colour strip */}
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${shown.color}, transparent)` }}
            />
            <div className="panel-scroll max-h-[50vh] overflow-y-auto p-5 sm:max-h-[78vh]">
              {/* header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ background: shown.color, boxShadow: `0 0 14px ${shown.color}` }}
                  />
                  <div>
                    <h2 className="font-display text-[22px] font-extrabold uppercase tracking-[0.14em] text-slate-50">
                      {shown.name}
                    </h2>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.26em]" style={{ color: shown.color }}>
                      {shown.typeLabel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close panel"
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors duration-300 hover:border-white/30 hover:text-slate-100"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* vital statistics */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Stat label="Diameter" value={`${shown.diameterKm.toLocaleString("en-US")} km`} />
                <Stat label="Distance from Sun" value={shown.distanceLabel} accent={shown.color} />
                <Stat label="Orbital period" value={shown.periodLabel} accent={shown.color} />
                <Stat label="Day length" value={shown.dayLength} />
                <Stat label="Moons" value={shown.kind === "star" ? "—" : String(shown.moons)} />
                <Stat label="Temperature" value={shown.temp} />
              </div>

              {/* field note */}
              <div className="mt-5 border-l-2 pl-3.5" style={{ borderColor: shown.color }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: shown.color }}>
                  Field note
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-300">{shown.fact}</p>
              </div>

              <p className="mt-5 text-[10px] leading-relaxed tracking-wide text-slate-500">
                Sizes and distances compressed for legibility — not to scale. Press{" "}
                <span className="text-slate-400">Esc</span> to release this world.
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

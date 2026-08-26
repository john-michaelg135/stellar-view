import { useEffect, useRef, useState } from "react";
import type { BodyData } from "../data/planets";
import { PLANET_DETAILS } from "../data/planetDetails";

const TAU = Math.PI * 2;

interface Props {
  body: BodyData | null;
  simDays: number;
  open: boolean;
  onClose: () => void;
}

export default function PlanetDetail({ body, simDays, open, onClose }: Props) {
  const [visible, setVisible] = useState(open);
  const [showWarp, setShowWarp] = useState(open);
  const [showContent, setShowContent] = useState(false);
  const [exitWarp, setExitWarp] = useState(false);
  const lastBodyRef = useRef<BodyData | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const visibleRef = useRef(open);
  const initializedRef = useRef(false);

  if (body && body.kind !== "belt") lastBodyRef.current = body;
  const displayBody = body && body.kind !== "belt" ? body : lastBodyRef.current;

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Handle open changes (enter/exit)
  useEffect(() => {
    if (open && !initializedRef.current) {
      // First mount with open=true — warp is already showing from initial state
      initializedRef.current = true;
      visibleRef.current = true;
      const t1 = setTimeout(() => {
        setShowWarp(false);
        setShowContent(true);
      }, 1400);
      timersRef.current.push(t1);
    } else if (open && initializedRef.current) {
      // Re-opening (shouldn't happen with key remount, but just in case)
      clearTimers();
      setVisible(true);
      visibleRef.current = true;
      setShowWarp(true);
      setShowContent(false);
      setExitWarp(false);
      const t1 = setTimeout(() => {
        setShowWarp(false);
        setShowContent(true);
      }, 1400);
      timersRef.current.push(t1);
    } else if (!open && visibleRef.current) {
      // EXIT — match the enter duration (1400ms)
      clearTimers();
      setShowContent(false);
      setExitWarp(true);
      const t1 = setTimeout(() => {
        setExitWarp(false);
        setVisible(false);
        visibleRef.current = false;
      }, 1400);
      timersRef.current.push(t1);
    }
  }, [open]);

  // Close handler: just tell parent to set open=false, the effect handles animation
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  if (!visible || !displayBody) return null;

  const detail = PLANET_DETAILS[displayBody.id];
  if (!detail) return null;

  const C = 250;
  const R = displayBody.kind === "star" ? 90 : 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* WARP TUNNEL (enter) */}
      {showWarp && (
        <div className="absolute inset-0 z-20">
          <WarpTunnel color={displayBody.color} reverse={false} />
        </div>
      )}

      {/* WARP TUNNEL (exit) */}
      {exitWarp && (
        <div className="absolute inset-0 z-20">
          <WarpTunnel color={displayBody.color} reverse={true} />
        </div>
      )}

      {/* BACKDROP */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          showContent ? "bg-space-950/90 opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* PLANET CONTENT */}
      <div
        className={`relative z-10 flex flex-col items-center gap-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showContent
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-[0.2] opacity-0 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={handleClose}
          aria-label="Close detail view"
          className="absolute -right-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-space-900/80 text-slate-400 backdrop-blur-sm transition-colors hover:border-white/30 hover:text-slate-100"
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {/* planet name */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-[0.2em] text-slate-50 sm:text-3xl">
            {displayBody.name}
          </h2>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: displayBody.color }}>
            {displayBody.typeLabel} · Close-up view
          </p>
        </div>

        {/* planet SVG */}
        <svg
          viewBox="0 0 500 500"
          className="h-[55vh] w-[55vh] max-h-[480px] max-w-[480px]"
          aria-label={`Close-up view of ${displayBody.name}`}
        >
          <defs>
            <radialGradient id="detail-grad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor={displayBody.colorLight} />
              <stop offset="45%" stopColor={displayBody.color} />
              <stop offset="100%" stopColor={displayBody.colorDark} />
            </radialGradient>
            <radialGradient id="detail-specular" cx="35%" cy="28%" r="25%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.45} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="detail-shadow" cx="72%" cy="68%" r="55%">
              <stop offset="0%" stopColor="#000000" stopOpacity={0.6} />
              <stop offset="55%" stopColor="#000000" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="detail-rim" cx="50%" cy="50%" r="50%">
              <stop offset="72%" stopColor="transparent" />
              <stop offset="90%" stopColor={displayBody.colorLight} stopOpacity={0.15} />
              <stop offset="100%" stopColor={displayBody.colorLight} stopOpacity={0.4} />
            </radialGradient>
            <radialGradient id="detail-atmo" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="82%" stopColor={displayBody.color} stopOpacity={0.1} />
              <stop offset="100%" stopColor={displayBody.colorLight} stopOpacity={0.22} />
            </radialGradient>
            {detail.magnetosphere && (
              <radialGradient id="detail-magneto" cx="50%" cy="50%" r="50%">
                <stop offset="55%" stopColor="transparent" />
                <stop offset="80%" stopColor={displayBody.color} stopOpacity={0.05} />
                <stop offset="100%" stopColor={displayBody.colorLight} stopOpacity={0.02} />
              </radialGradient>
            )}
            <clipPath id="detail-clip">
              <circle cx={C} cy={C} r={R} />
            </clipPath>
          </defs>

          {detail.magnetosphere && (
            <circle cx={C} cy={C} r={R * 2.2} fill="url(#detail-magneto)" className="animate-pulse" style={{ animationDuration: "4s" }} />
          )}

          {detail.atmosphere.map((layer, i) => (
            <circle key={i} cx={C} cy={C} r={R * layer.radius} fill="none" stroke={layer.color} strokeWidth={2} opacity={layer.opacity * 2.5} strokeDasharray={i % 2 === 0 ? undefined : "2 6"} />
          ))}
          {detail.atmosphere.length > 0 && (
            <circle cx={C} cy={C} r={R * (detail.atmosphere[detail.atmosphere.length - 1]?.radius ?? 1.1)} fill="url(#detail-atmo)" />
          )}

          {detail.ringDetail && (
            <g transform={`translate(${C} ${C})`}>
              <path d={`M ${-R * detail.ringDetail.outerRadius} 0 A ${R * detail.ringDetail.outerRadius} ${R * detail.ringDetail.outerRadius * 0.3} 0 0 1 ${R * detail.ringDetail.outerRadius} 0`} fill="none" stroke={detail.ringDetail.color} strokeWidth={R * (detail.ringDetail.outerRadius - detail.ringDetail.innerRadius) * 0.6} opacity={detail.ringDetail.opacity * 0.4} />
            </g>
          )}

          <circle cx={C} cy={C} r={R} fill="url(#detail-grad)" />
          <circle cx={C} cy={C} r={R} fill="url(#detail-shadow)" />
          <circle cx={C} cy={C} r={R} fill="url(#detail-rim)" />
          <circle cx={C} cy={C} r={R} fill="url(#detail-specular)" />

          <g clipPath="url(#detail-clip)">
            {detail.surfaceFeatures.map((feat, i) => {
              const fx = C + feat.x * R;
              const fy = C + feat.y * R;
              const fs = feat.size * R;
              if (feat.type === "crater") return <g key={i}><circle cx={fx} cy={fy} r={fs} fill="none" stroke={feat.color} strokeWidth={1.2} opacity={0.7} /><circle cx={fx} cy={fy} r={fs * 0.6} fill={feat.color} opacity={0.25} /></g>;
              if (feat.type === "volcano") return <g key={i}><circle cx={fx} cy={fy} r={fs} fill={feat.color} opacity={0.4} /><circle cx={fx} cy={fy} r={fs * 0.4} fill={feat.color} opacity={0.7} /></g>;
              if (feat.type === "storm") return <g key={i}><ellipse cx={fx} cy={fy} rx={fs} ry={fs * 0.6} fill={feat.color} opacity={0.8} /><ellipse cx={fx} cy={fy} rx={fs * 0.7} ry={fs * 0.4} fill="none" stroke={feat.color} strokeWidth={0.8} opacity={0.5} className="spin-slow" style={{ transformOrigin: `${fx}px ${fy}px` }} /></g>;
              if (feat.type === "icecap") return <ellipse key={i} cx={fx} cy={fy} rx={fs * 1.5} ry={fs * 0.6} fill={feat.color} opacity={0.6} />;
              if (feat.type === "band") return <rect key={i} x={C - R * feat.size * 0.5} y={fy - fs * 0.15} width={R * feat.size} height={fs * 0.3} rx={fs * 0.1} fill={feat.color} opacity={0.3} />;
              if (feat.type === "spot") return <circle key={i} cx={fx} cy={fy} r={fs} fill={feat.color} opacity={0.6} />;
              return null;
            })}
          </g>

          {detail.ringDetail && (
            <g transform={`translate(${C} ${C})`}>
              <path d={`M ${-R * detail.ringDetail.outerRadius} 0 A ${R * detail.ringDetail.outerRadius} ${R * detail.ringDetail.outerRadius * 0.3} 0 0 0 ${R * detail.ringDetail.outerRadius} 0`} fill="none" stroke={detail.ringDetail.color} strokeWidth={R * (detail.ringDetail.outerRadius - detail.ringDetail.innerRadius) * 0.6} opacity={detail.ringDetail.opacity * 0.9} />
              {Array.from({ length: detail.ringDetail.divisions }).map((_, i) => {
                const frac = (i + 1) / (detail.ringDetail!.divisions + 1);
                const ringR = R * (detail.ringDetail!.innerRadius + frac * (detail.ringDetail!.outerRadius - detail.ringDetail!.innerRadius));
                return <ellipse key={i} rx={ringR} ry={ringR * 0.3} fill="none" stroke="#04060f" strokeWidth={0.8} opacity={0.5} />;
              })}
            </g>
          )}

          {detail.moons.map((moon, i) => {
            const angle = TAU * (((simDays % moon.periodDays) / moon.periodDays + i * 0.25) % 1);
            const mx = C + moon.orbitRadius * Math.cos(angle);
            const my = C + moon.orbitRadius * Math.sin(angle) * 0.4;
            return (
              <g key={moon.name}>
                <ellipse cx={C} cy={C} rx={moon.orbitRadius} ry={moon.orbitRadius * 0.4} fill="none" stroke={moon.color} strokeOpacity={0.2} strokeWidth={0.7} strokeDasharray="3 6" />
                <circle cx={mx} cy={my} r={moon.radius} fill={moon.color} />
                <circle cx={mx - moon.radius * 0.3} cy={my - moon.radius * 0.3} r={moon.radius * 0.3} fill={moon.colorDark} opacity={0.3} />
                <text x={mx} y={my + moon.radius + 12} textAnchor="middle" fontSize={9} letterSpacing={1.5} fill="#9fadd2" className="font-body uppercase">{moon.name}</text>
              </g>
            );
          })}

          <g transform={`translate(${C} ${C})`} opacity={0.5}>
            <line x1={0} y1={-R - 18} x2={0} y2={R + 18} stroke={displayBody.colorLight} strokeWidth={0.7} strokeDasharray="3 4" transform={`rotate(${-detail.axialTilt})`} />
            <text x={14} y={-R - 10} fontSize={8} fill={displayBody.colorLight} opacity={0.7} transform={`rotate(${-detail.axialTilt})`} className="font-body">{detail.axialTilt.toFixed(1)}°</text>
          </g>
        </svg>

        {detail.moons.length > 0 && (
          <div className="mt-1 flex max-w-lg flex-wrap justify-center gap-2 px-4">
            {detail.moons.map((moon) => (
              <div key={moon.name} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: moon.color }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-200">{moon.name}</span>
                </div>
                {moon.fact && <p className="mt-1 max-w-[200px] text-[10px] leading-relaxed text-slate-400">{moon.fact}</p>}
              </div>
            ))}
          </div>
        )}

        <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] text-slate-500">
          Press <span className="text-slate-300">Esc</span> or <span className="text-slate-300">Z</span> to return
        </p>
      </div>
    </div>
  );
}

// --- Warp Tunnel ---

function WarpTunnel({ color, reverse }: { color: string; reverse: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;

    const STAR_COUNT = 400;
    const DURATION = 1.4; // match the 1400ms timeout
    const stars: { x: number; y: number; z: number; speed: number }[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * W * 2.5,
        y: (Math.random() - 0.5) * H * 2.5,
        z: reverse ? Math.random() * 200 + 1 : Math.random() * 1500 + 100,
        speed: Math.random() * 25 + 35,
      });
    }

    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;
      ctx.fillStyle = "rgba(4, 6, 15, 0.25)";
      ctx.fillRect(0, 0, W, H);

      // Both directions use the same acceleration curve shape over the same duration
      // Forward: accelerates in (stars rush toward you)
      // Reverse: accelerates out (stars rush away from you) — same ramp, opposite direction
      const t = Math.min(elapsed / DURATION, 1);
      const accel = reverse ? Math.min(t * 3, 4) : Math.min(elapsed * 3, 4);

      for (const star of stars) {
        const prevZ = star.z;
        if (reverse) {
          star.z += star.speed * accel;
          if (star.z >= 2000) { star.z = 10; star.x = (Math.random() - 0.5) * W * 2.5; star.y = (Math.random() - 0.5) * H * 2.5; }
        } else {
          star.z -= star.speed * accel;
          if (star.z <= 1) { star.z = 1500; star.x = (Math.random() - 0.5) * W * 2.5; star.y = (Math.random() - 0.5) * H * 2.5; }
        }

        const sx = cx + (star.x / star.z) * 500;
        const sy = cy + (star.y / star.z) * 500;
        const prevSx = cx + (star.x / prevZ) * 500;
        const prevSy = cy + (star.y / prevZ) * 500;

        const depth = reverse ? 1 - (star.z / 2000) : (1500 - star.z) / 1500;
        const brightness = Math.min(1, depth * 1.5);

        ctx.beginPath();
        ctx.moveTo(prevSx, prevSy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = brightness > 0.5 ? color : `rgba(200, 220, 255, ${brightness})`;
        ctx.lineWidth = Math.max(0.5, depth * 3);
        ctx.globalAlpha = brightness * 0.85;
        ctx.stroke();
      }

      const glowSize = reverse ? Math.min(elapsed * 60, 180) : Math.min(elapsed * 60, 180);
      if (glowSize > 0) {
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
        gradient.addColorStop(0, color + "66");
        gradient.addColorStop(0.4, color + "22");
        gradient.addColorStop(1, "transparent");
        ctx.globalAlpha = reverse ? Math.min(elapsed * 0.6, 1) : Math.min(elapsed * 0.6, 1);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, glowSize, 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [color, reverse]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

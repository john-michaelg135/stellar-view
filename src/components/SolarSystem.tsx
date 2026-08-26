import type { ReactNode } from "react";
import { ASTEROID_BELT, BELT_INNER_RADIUS, BELT_OUTER_RADIUS, PLANETS, SUN, type BodyData } from "../data/planets";

const C = 500; // viewBox center
const TAU = Math.PI * 2;
const TRAIL = TAU * 0.065; // trail arc = 6.5% of any orbit

const polar = (r: number, a: number) => ({
  x: C + r * Math.cos(a),
  y: C - r * Math.sin(a),
});

const angleOf = (p: BodyData, simDays: number) => {
  const frac = ((simDays % p.periodDays) + p.periodDays) % p.periodDays;
  return p.initialAngle + TAU * (frac / p.periodDays);
};

const shortDistance = (p: BodyData) => {
  if (p.kind === "star") return "G2V star";
  if (p.distanceMkm < 1000) return `${p.distanceMkm}M km`;
  return `${(p.distanceMkm / 1000).toFixed(2)}B km`;
};

/** Simple seeded PRNG for deterministic asteroid positions */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Pre-generate asteroid positions (deterministic)
const ASTEROID_COUNT = 180;
const asteroids: { r: number; baseAngle: number; size: number; opacity: number; speed: number }[] = [];
{
  const rng = seededRandom(42);
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const r = BELT_INNER_RADIUS + rng() * (BELT_OUTER_RADIUS - BELT_INNER_RADIUS);
    const baseAngle = rng() * TAU;
    const size = 0.8 + rng() * 1.8;
    const opacity = 0.25 + rng() * 0.5;
    // Each asteroid gets a slightly different period (3.2–5.9 years range)
    const speed = 0.7 + rng() * 0.6; // multiplier on the belt's average period
    asteroids.push({ r, baseAngle, size, opacity, speed });
  }
}

interface Props {
  simDays: number;
  selectedId: string | null;
  hoveredId: string | null;
  showOrbits: boolean;
  showLabels: boolean;
  zoomed: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onDoubleClick: (id: string) => void;
}

export default function SolarSystem({
  simDays,
  selectedId,
  hoveredId,
  showOrbits,
  showLabels,
  zoomed,
  onSelect,
  onHover,
  onDoubleClick,
}: Props) {
  const renderPlanet = (p: BodyData) => {
    const a = angleOf(p, simDays);
    const pos = polar(p.orbitRadius, a);
    const r = p.displayRadius;
    const selected = selectedId === p.id;
    const hovered = hoveredId === p.id;

    // fading motion trail
    const s0 = polar(p.orbitRadius, a - TRAIL);
    const trailPath = `M ${s0.x.toFixed(2)} ${s0.y.toFixed(2)} A ${p.orbitRadius} ${p.orbitRadius} 0 0 0 ${pos.x.toFixed(2)} ${pos.y.toFixed(2)}`;

    // saturn-style rings (split so the front half passes over the globe)
    const rx = r * 1.95;
    const ry = r * 0.62;
    const ringBack = `M ${-rx} 0 A ${rx} ${ry} 0 0 1 ${rx} 0`;
    const ringFront = `M ${-rx} 0 A ${rx} ${ry} 0 0 0 ${rx} 0`;
    const rx2 = rx + 6;
    const ry2 = ry + 2.6;

    let moonNode: ReactNode = null;
    if (p.moon) {
      const ma = -TAU * ((simDays % p.moon.periodDays) / p.moon.periodDays);
      const mx = Math.cos(ma) * p.moon.radius;
      const my = Math.sin(ma) * p.moon.radius * 0.42; // slight elliptical tilt
      moonNode = (
        <g>
          <circle r={p.moon.radius} fill="none" stroke="#8ea2d0" strokeOpacity={0.22} strokeWidth={0.7} transform="scale(1 0.42)" />
          <circle cx={mx} cy={my} r={p.moon.size} fill={p.moon.color} />
        </g>
      );
    }

    const chipText = `${p.name} · ${shortDistance(p)}`;
    const chipW = chipText.length * 6.8 + 22;

    return (
      <g key={p.id}>
        {/* orbit guide */}
        <circle
          className="orbit-ring"
          cx={C}
          cy={C}
          r={p.orbitRadius}
          fill="none"
          stroke={selected ? p.color : "#8ea2d0"}
          strokeOpacity={selected ? 0.55 : hovered ? 0.34 : 0.15}
          strokeWidth={selected ? 1.3 : 1}
          strokeDasharray={selected ? "5 7" : undefined}
          opacity={showOrbits ? 1 : 0}
        />
        {/* motion trail */}
        <path
          d={trailPath}
          fill="none"
          stroke={p.color}
          strokeOpacity={selected ? 0.5 : 0.3}
          strokeWidth={Math.max(r * 0.55, 2.4)}
          strokeLinecap="round"
        />
        {/* planet node */}
        <g
          className="planet-node"
          transform={`translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(p.id);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onSelect(p.id);
            onDoubleClick(p.id);
          }}
          onMouseEnter={() => onHover(p.id)}
          onMouseLeave={() => onHover(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onSelect(p.id);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`${p.name} — ${p.typeLabel}. Distance from Sun ${p.distanceLabel}. Orbital period ${p.periodLabel}.`}
        >
          <circle r={Math.max(r + 10, 17)} fill="transparent" />
          <g className="planet-body">
            {p.ring === "saturn" && (
              <g transform="rotate(-16)" opacity={0.95}>
                <path d={ringBack} fill="none" stroke="#efe0b0" strokeWidth={3.4} strokeOpacity={0.55} />
                <path d={`M ${-rx2} 0 A ${rx2} ${ry2} 0 0 1 ${rx2} 0`} fill="none" stroke="#d9c48c" strokeWidth={1.3} strokeOpacity={0.4} />
              </g>
            )}
            {p.ring === "uranus" && (
              <ellipse rx={r * 1.75} ry={r * 0.52} transform="rotate(74)" fill="none" stroke="rgba(205,240,244,0.5)" strokeWidth={1.3} />
            )}
            <circle r={r} fill={`url(#grad-${p.id})`} />
            {p.bands && (
              <g clipPath={`url(#clip-${p.id})`}>
                <rect x={-r} y={-r * 0.62} width={r * 2} height={r * 0.2} fill={p.colorDark} opacity={0.22} />
                <rect x={-r} y={-r * 0.24} width={r * 2} height={r * 0.16} fill={p.colorLight} opacity={0.25} />
                <rect x={-r} y={r * 0.08} width={r * 2} height={r * 0.2} fill={p.colorDark} opacity={0.26} />
                <rect x={-r} y={r * 0.44} width={r * 2} height={r * 0.18} fill={p.colorDark} opacity={0.18} />
                {p.id === "jupiter" && (
                  <ellipse cx={r * 0.38} cy={r * 0.3} rx={r * 0.24} ry={r * 0.14} fill="#c65f3d" opacity={0.85} />
                )}
              </g>
            )}
            {p.ring === "saturn" && (
              <g transform="rotate(-16)">
                <path d={ringFront} fill="none" stroke="#f2e4b6" strokeWidth={3.4} strokeOpacity={0.95} />
                <path d={`M ${-rx2} 0 A ${rx2} ${ry2} 0 0 0 ${rx2} 0`} fill="none" stroke="#e0cba0" strokeWidth={1.3} strokeOpacity={0.7} />
              </g>
            )}
            {moonNode}
          </g>

          {selected && (
            <g className="spin-slow">
              <circle
                className="ring-pulse"
                r={r + 9}
                fill="none"
                stroke={p.color}
                strokeWidth={1.5}
                strokeDasharray="5 7"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* hover data chip */}
          {(hovered || selected) && (
            <g transform={`translate(0 ${-(r + 14)})`} pointerEvents="none">
              <rect x={-chipW / 2} y={-27} width={chipW} height={23} rx={5} fill="#0b1228" fillOpacity={0.94} stroke={p.color} strokeOpacity={0.55} strokeWidth={1} />
              <text x={0} y={-11.5} textAnchor="middle" fontSize={12.5} fill="#e6ecff" className="font-body" letterSpacing={0.4}>
                {chipText}
              </text>
            </g>
          )}

          {showLabels && (
            <text
              x={0}
              y={r + 20}
              textAnchor="middle"
              fontSize={12.5}
              letterSpacing={2.4}
              fill={selected ? p.colorLight : "#9fadd2"}
              fontWeight={selected ? 700 : 500}
              className="font-body uppercase pointer-events-none"
            >
              {p.name}
            </text>
          )}
        </g>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      className={`absolute inset-0 h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        zoomed ? "scale-[4] opacity-0 blur-md" : "scale-100 opacity-100 blur-0"
      }`}
      onClick={() => onSelect(null)}
      role="application"
      aria-label="Solar system map. Eight planets orbit the Sun; select any body for details."
    >
      <defs>
        <radialGradient id="grad-sun" cx="42%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="38%" stopColor="#ffd76a" />
          <stop offset="72%" stopColor="#ff9d3c" />
          <stop offset="100%" stopColor="#f2600c" />
        </radialGradient>
        <radialGradient id="sun-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,186,88,0.55)" />
          <stop offset="45%" stopColor="rgba(255,150,60,0.22)" />
          <stop offset="100%" stopColor="rgba(255,140,50,0)" />
        </radialGradient>
        {[SUN, ...PLANETS].map((p) => (
          <radialGradient key={p.id} id={`grad-${p.id}`} cx="35%" cy="32%" r="75%">
            <stop offset="0%" stopColor={p.colorLight} />
            <stop offset="52%" stopColor={p.color} />
            <stop offset="100%" stopColor={p.colorDark} />
          </radialGradient>
        ))}
        {PLANETS.filter((p) => p.bands).map((p) => (
          <clipPath key={`clip-${p.id}`} id={`clip-${p.id}`}>
            <circle r={p.displayRadius} />
          </clipPath>
        ))}
      </defs>

      {/* ------- the Sun ------- */}
      <g
        className="planet-node"
        transform={`translate(${C} ${C})`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("sun");
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onSelect("sun");
          onDoubleClick("sun");
        }}
        onMouseEnter={() => onHover("sun")}
        onMouseLeave={() => onHover(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onSelect("sun");
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="The Sun — G-type main-sequence star at the center of the system."
      >
        <circle r={70} fill="transparent" />
        <g className="planet-body">
          <circle className="sun-breathe" r={118} fill="url(#sun-halo)" pointerEvents="none" />
          <g className="spin-slow" pointerEvents="none">
            <circle r={54} fill="none" stroke="rgba(255,196,110,0.4)" strokeWidth={1.4} strokeDasharray="3 15" strokeLinecap="round" />
          </g>
          <g className="spin-rev" pointerEvents="none">
            <circle r={66} fill="none" stroke="rgba(255,170,80,0.22)" strokeWidth={1.1} strokeDasharray="1.5 24" strokeLinecap="round" />
          </g>
          <circle r={SUN.displayRadius} fill="url(#grad-sun)" />
        </g>
        {selectedId === "sun" && (
          <g className="spin-slow">
            <circle className="ring-pulse" r={SUN.displayRadius + 11} fill="none" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 7" strokeLinecap="round" />
          </g>
        )}
        {(hoveredId === "sun" || selectedId === "sun") && (
          <g transform={`translate(0 ${-(SUN.displayRadius + 16)})`} pointerEvents="none">
            <rect x={-62} y={-27} width={124} height={23} rx={5} fill="#0b1228" fillOpacity={0.94} stroke="#fbbf24" strokeOpacity={0.55} strokeWidth={1} />
            <text x={0} y={-11.5} textAnchor="middle" fontSize={12.5} fill="#ffe9b8" className="font-body" letterSpacing={0.4}>
              The Sun · G2V star
            </text>
          </g>
        )}
        {showLabels && (
          <text
            x={0}
            y={SUN.displayRadius + 24}
            textAnchor="middle"
            fontSize={12.5}
            letterSpacing={2.4}
            fill={selectedId === "sun" ? "#fde68a" : "#9fadd2"}
            fontWeight={selectedId === "sun" ? 700 : 500}
            className="font-body uppercase pointer-events-none"
          >
            Sun
          </text>
        )}
      </g>

      {/* ------- Asteroid Belt ------- */}
      {(() => {
        const beltSelected = selectedId === "asteroid-belt";
        const beltHovered = hoveredId === "asteroid-belt";
        const highlight = beltSelected || beltHovered;
        return (
          <g
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect("asteroid-belt");
            }}
            onMouseEnter={() => onHover("asteroid-belt")}
            onMouseLeave={() => onHover(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onSelect("asteroid-belt");
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Asteroid Belt — main belt between Mars and Jupiter containing over one million objects."
          >
            {/* invisible hit area ring */}
            <circle
              cx={C}
              cy={C}
              r={ASTEROID_BELT.orbitRadius}
              fill="none"
              stroke="transparent"
              strokeWidth={BELT_OUTER_RADIUS - BELT_INNER_RADIUS}
            />
            {/* belt boundary guides when highlighted */}
            {highlight && (
              <>
                <circle cx={C} cy={C} r={BELT_INNER_RADIUS} fill="none" stroke={ASTEROID_BELT.color} strokeOpacity={0.25} strokeWidth={0.7} strokeDasharray="4 8" />
                <circle cx={C} cy={C} r={BELT_OUTER_RADIUS} fill="none" stroke={ASTEROID_BELT.color} strokeOpacity={0.25} strokeWidth={0.7} strokeDasharray="4 8" />
              </>
            )}
            {/* asteroids */}
            {asteroids.map((ast, i) => {
              const angle = ast.baseAngle + TAU * (((simDays / (ASTEROID_BELT.periodDays * ast.speed)) % 1 + 1) % 1);
              const pos = polar(ast.r, angle);
              return (
                <circle
                  key={i}
                  cx={pos.x}
                  cy={pos.y}
                  r={highlight ? ast.size * 1.3 : ast.size}
                  fill={highlight ? ASTEROID_BELT.colorLight : ASTEROID_BELT.color}
                  opacity={highlight ? Math.min(ast.opacity + 0.35, 1) : ast.opacity}
                />
              );
            })}
            {/* selected ring pulse */}
            {beltSelected && (
              <g className="spin-slow">
                <circle
                  cx={C}
                  cy={C}
                  className="ring-pulse"
                  r={ASTEROID_BELT.orbitRadius}
                  fill="none"
                  stroke={ASTEROID_BELT.color}
                  strokeWidth={1.2}
                  strokeDasharray="5 12"
                  strokeLinecap="round"
                />
              </g>
            )}
            {/* hover chip */}
            {highlight && (
              <g transform={`translate(${C} ${C - BELT_OUTER_RADIUS - 14})`} pointerEvents="none">
                <rect x={-82} y={-27} width={164} height={23} rx={5} fill="#0b1228" fillOpacity={0.94} stroke={ASTEROID_BELT.color} strokeOpacity={0.55} strokeWidth={1} />
                <text x={0} y={-11.5} textAnchor="middle" fontSize={12.5} fill="#e6ecff" className="font-body" letterSpacing={0.4}>
                  Asteroid Belt · Main belt
                </text>
              </g>
            )}
            {/* label */}
            {showLabels && (
              <text
                x={C}
                y={C - BELT_OUTER_RADIUS - 6}
                textAnchor="middle"
                fontSize={12.5}
                letterSpacing={2.4}
                fill={beltSelected ? ASTEROID_BELT.colorLight : "#9fadd2"}
                fontWeight={beltSelected ? 700 : 500}
                className="font-body uppercase pointer-events-none"
                opacity={highlight ? 1 : 0}
              >
                Asteroid Belt
              </text>
            )}
          </g>
        );
      })()}

      {PLANETS.map(renderPlanet)}
    </svg>
  );
}

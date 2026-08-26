export interface BodyData {
  id: string;
  name: string;
  kind: "star" | "rocky" | "gas" | "ice" | "belt";
  typeLabel: string;
  /** display radius in viewBox units (not to scale) */
  displayRadius: number;
  /** orbital radius in viewBox units; 0 for the Sun */
  orbitRadius: number;
  /** sidereal orbital period in Earth days */
  periodDays: number;
  /** starting angle in radians so planets scatter nicely on load */
  initialAngle: number;
  color: string;
  colorLight: string;
  colorDark: string;
  /* --- real statistics --- */
  diameterKm: number;
  distanceMkm: number;
  distanceLabel: string;
  periodLabel: string;
  dayLength: string;
  moons: number;
  temp: string;
  fact: string;
  /** draw cloud bands (gas / ice giants) */
  bands?: boolean;
  ring?: "saturn" | "uranus";
  moon?: { name: string; radius: number; periodDays: number; size: number; color: string };
}

export const SUN: BodyData = {
  id: "sun",
  name: "The Sun",
  kind: "star",
  typeLabel: "G-type main-sequence star",
  displayRadius: 42,
  orbitRadius: 0,
  periodDays: 0,
  initialAngle: 0,
  color: "#ffb547",
  colorLight: "#fff3c4",
  colorDark: "#f2600c",
  diameterKm: 1392700,
  distanceMkm: 0,
  distanceLabel: "0 km — system center",
  periodLabel: "≈230M yr (galactic)",
  dayLength: "~27 Earth days (equator)",
  moons: 0,
  temp: "5,505 °C surface",
  fact: "The Sun holds 99.86% of all mass in the Solar System — every planet, moon and asteroid shares the remaining 0.14%.",
};

export const PLANETS: BodyData[] = [
  {
    id: "mercury",
    name: "Mercury",
    kind: "rocky",
    typeLabel: "Terrestrial planet",
    displayRadius: 6,
    orbitRadius: 92,
    periodDays: 87.97,
    initialAngle: 0.7,
    color: "#b3a08f",
    colorLight: "#e2d3c0",
    colorDark: "#5f5348",
    diameterKm: 4879,
    distanceMkm: 57.9,
    distanceLabel: "57.9 million km",
    periodLabel: "88 Earth days",
    dayLength: "59 Earth days",
    moons: 0,
    temp: "167 °C mean",
    fact: "A single solar day on Mercury — sunrise to sunrise — lasts 176 Earth days: twice as long as its entire year.",
  },
  {
    id: "venus",
    name: "Venus",
    kind: "rocky",
    typeLabel: "Terrestrial planet",
    displayRadius: 9.5,
    orbitRadius: 128,
    periodDays: 224.7,
    initialAngle: 2.5,
    color: "#e6c07a",
    colorLight: "#fae7b4",
    colorDark: "#96692c",
    diameterKm: 12104,
    distanceMkm: 108.2,
    distanceLabel: "108.2 million km",
    periodLabel: "225 Earth days",
    dayLength: "243 Earth days",
    moons: 0,
    temp: "464 °C — hottest planet",
    fact: "Venus spins backwards, so its Sun rises in the west — and one Venus day outlasts its entire year.",
  },
  {
    id: "earth",
    name: "Earth",
    kind: "rocky",
    typeLabel: "Terrestrial planet",
    displayRadius: 10,
    orbitRadius: 168,
    periodDays: 365.26,
    initialAngle: 4.4,
    color: "#3f7fd4",
    colorLight: "#a7d3ff",
    colorDark: "#173a75",
    diameterKm: 12742,
    distanceMkm: 149.6,
    distanceLabel: "149.6 million km",
    periodLabel: "365.25 days",
    dayLength: "23.9 hours",
    moons: 1,
    temp: "15 °C mean",
    fact: "The only world known to host liquid surface water — 71% of Earth is ocean, and every map you own is mostly blue.",
    moon: { name: "Moon", radius: 19, periodDays: 27.32, size: 3, color: "#c9d3e0" },
  },
  {
    id: "mars",
    name: "Mars",
    kind: "rocky",
    typeLabel: "Terrestrial planet",
    displayRadius: 7.5,
    orbitRadius: 208,
    periodDays: 686.98,
    initialAngle: 5.65,
    color: "#d1683f",
    colorLight: "#f5a87b",
    colorDark: "#7e3018",
    diameterKm: 6779,
    distanceMkm: 227.9,
    distanceLabel: "227.9 million km",
    periodLabel: "687 Earth days",
    dayLength: "24.6 hours",
    moons: 2,
    temp: "−65 °C mean",
    fact: "Olympus Mons towers 22 km above the plains — nearly three Everests — making it the tallest volcano we know of.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kind: "gas",
    typeLabel: "Gas giant",
    displayRadius: 24,
    orbitRadius: 306,
    periodDays: 4332.59,
    initialAngle: 1.75,
    color: "#d8a56b",
    colorLight: "#f4d9ac",
    colorDark: "#8a5a30",
    diameterKm: 139820,
    distanceMkm: 778.5,
    distanceLabel: "778.5 million km",
    periodLabel: "11.9 Earth years",
    dayLength: "9.9 hours — fastest spin",
    moons: 95,
    temp: "−110 °C cloud tops",
    fact: "The Great Red Spot is a storm wider than Earth that has been raging for at least 190 years — possibly 350.",
    bands: true,
    moon: { name: "Io", radius: 34, periodDays: 15.2, size: 2.6, color: "#e8d27a" },
  },
  {
    id: "saturn",
    name: "Saturn",
    kind: "gas",
    typeLabel: "Gas giant",
    displayRadius: 20,
    orbitRadius: 366,
    periodDays: 10759.22,
    initialAngle: 3.55,
    color: "#e3c584",
    colorLight: "#f9ecc4",
    colorDark: "#94763d",
    diameterKm: 116460,
    distanceMkm: 1434,
    distanceLabel: "1.43 billion km",
    periodLabel: "29.4 Earth years",
    dayLength: "10.7 hours",
    moons: 146,
    temp: "−140 °C cloud tops",
    fact: "Saturn is the least dense planet — about 0.69 g/cm³. Given a big enough bathtub, it would float.",
    bands: true,
    ring: "saturn",
    moon: { name: "Titan", radius: 42, periodDays: 23.6, size: 2.8, color: "#d9b46a" },
  },
  {
    id: "uranus",
    name: "Uranus",
    kind: "ice",
    typeLabel: "Ice giant",
    displayRadius: 14,
    orbitRadius: 418,
    periodDays: 30688.5,
    initialAngle: 0.15,
    color: "#8fd4d9",
    colorLight: "#dcf6f6",
    colorDark: "#3f8892",
    diameterKm: 50724,
    distanceMkm: 2871,
    distanceLabel: "2.87 billion km",
    periodLabel: "84 Earth years",
    dayLength: "17.2 hours",
    moons: 28,
    temp: "−195 °C — coldest air",
    fact: "Uranus rolls around the Sun on its side, tilted 98° — each pole gets 42 years of daylight, then 42 of night.",
    ring: "uranus",
    moon: { name: "Titania", radius: 24, periodDays: 19.4, size: 2.2, color: "#b9cdd6" },
  },
  {
    id: "neptune",
    name: "Neptune",
    kind: "ice",
    typeLabel: "Ice giant",
    displayRadius: 13.5,
    orbitRadius: 464,
    periodDays: 60182,
    initialAngle: 5.05,
    color: "#4a6fd4",
    colorLight: "#9cb6f5",
    colorDark: "#20387c",
    diameterKm: 49244,
    distanceMkm: 4495,
    distanceLabel: "4.50 billion km",
    periodLabel: "164.8 Earth years",
    dayLength: "16.1 hours",
    moons: 16,
    temp: "−200 °C cloud tops",
    fact: "Neptune's winds hit 2,100 km/h — the fastest in the Solar System — on a world that receives 1/900th of our sunlight.",
    bands: true,
    moon: { name: "Triton", radius: 24, periodDays: 14.1, size: 2.4, color: "#cfe0ee" },
  },
];

export const ASTEROID_BELT: BodyData = {
  id: "asteroid-belt",
  name: "Asteroid Belt",
  kind: "belt",
  typeLabel: "Main asteroid belt",
  displayRadius: 0,
  orbitRadius: 257, // midpoint between Mars (208) and Jupiter (306)
  periodDays: 1682, // ~4.6 yr — average for main belt (similar to Ceres)
  initialAngle: 0,
  color: "#a89070",
  colorLight: "#d4bfa8",
  colorDark: "#6b5540",
  diameterKm: 329_000_000, // width of belt (~2.0 to 3.3 AU)
  distanceMkm: 478,
  distanceLabel: "329–478 million km",
  periodLabel: "3.2–5.9 Earth years",
  dayLength: "Varies (5–24 hours typical)",
  moons: 0,
  temp: "−73 °C average",
  fact: "Despite Hollywood's depictions, the belt is mostly empty space — spacecraft pass through routinely without incident. It contains over a million objects larger than 1 km, yet their total mass is just 4% of our Moon.",
};

/** Inner and outer orbital radii of the belt (viewBox units) */
export const BELT_INNER_RADIUS = 230;
export const BELT_OUTER_RADIUS = 284;

/**
 * Accurate planetary positions using JPL's Keplerian Elements (Table 1).
 * Valid for 1800 AD – 2050 AD.
 * Source: https://ssd.jpl.nasa.gov/planets/approx_pos.html
 *
 * For each planet we store:
 *   [L0, Ldot, e0, edot, wbar0, wbardot]
 * Where:
 *   L = mean longitude (deg), Ldot = rate (deg/century)
 *   e = eccentricity (rad), edot = rate (rad/century)
 *   wbar = longitude of perihelion (deg), wbardot = rate (deg/century)
 */
interface OrbitalElements {
  L0: number; Ldot: number;
  e0: number; edot: number;
  wbar0: number; wbardot: number;
}

const JPL_ELEMENTS: Record<string, OrbitalElements> = {
  mercury: { L0: 252.25032350, Ldot: 149472.67411175, e0: 0.20563593, edot: 0.00001906, wbar0: 77.45779628, wbardot: 0.16047689 },
  venus:   { L0: 181.97909950, Ldot:  58517.81538729, e0: 0.00677672, edot: -0.00004107, wbar0: 131.60246718, wbardot: 0.00268329 },
  earth:   { L0: 100.46457166, Ldot:  35999.37244981, e0: 0.01671123, edot: -0.00004392, wbar0: 102.93768193, wbardot: 0.32327364 },
  mars:    { L0:  -4.55343205, Ldot:  19140.30268499, e0: 0.09339410, edot: 0.00007882, wbar0: -23.94362959, wbardot: 0.44441088 },
  jupiter: { L0:  34.39644051, Ldot:   3034.74612775, e0: 0.04838624, edot: -0.00013253, wbar0: 14.72847983, wbardot: 0.21252668 },
  saturn:  { L0:  49.95424423, Ldot:   1222.49362201, e0: 0.05386179, edot: -0.00050991, wbar0: 92.59887831, wbardot: -0.41897216 },
  uranus:  { L0: 313.23810451, Ldot:    428.48202785, e0: 0.04725744, edot: -0.00004397, wbar0: 170.95427630, wbardot: 0.40805281 },
  neptune: { L0: -55.12002969, Ldot:    218.45945325, e0: 0.00859048, edot: 0.00005105, wbar0: 44.96476227, wbardot: -0.32241464 },
};

/** Centuries elapsed since J2000.0 epoch (Jan 1, 2000 12:00 TT) */
function centuriesSinceJ2000(): number {
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const now = Date.now();
  return (now - j2000) / (86_400_000 * 36525);
}

/** Normalize angle to [0, 360) */
function normDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

/** Solve Kepler's equation: M = E - e*sin(E), returns E in degrees */
function solveKepler(M_deg: number, e: number): number {
  const eStar = e * (180 / Math.PI); // e in degrees for the formula
  let E = M_deg + eStar * Math.sin((M_deg * Math.PI) / 180);
  for (let i = 0; i < 20; i++) {
    const dM = M_deg - (E - eStar * Math.sin((E * Math.PI) / 180));
    const dE = dM / (1 - e * Math.cos((E * Math.PI) / 180));
    E += dE;
    if (Math.abs(dE) < 1e-6) break;
  }
  return E;
}

/**
 * Compute the heliocentric ecliptic longitude of a planet (in radians)
 * for the current date, using JPL Keplerian elements + Kepler's equation.
 */
function computeTrueLongitude(planetId: string): number {
  const el = JPL_ELEMENTS[planetId];
  if (!el) return 0;

  const T = centuriesSinceJ2000();

  // Current elements
  const L = normDeg(el.L0 + el.Ldot * T);       // mean longitude (deg)
  const e = el.e0 + el.edot * T;                  // eccentricity
  const wbar = normDeg(el.wbar0 + el.wbardot * T); // longitude of perihelion (deg)

  // Mean anomaly
  const M = normDeg(L - wbar);

  // Solve Kepler's equation for eccentric anomaly E
  const E = solveKepler(M, e);

  // True anomaly ν from E
  const E_rad = (E * Math.PI) / 180;
  const sinV = (Math.sqrt(1 - e * e) * Math.sin(E_rad)) / (1 - e * Math.cos(E_rad));
  const cosV = (Math.cos(E_rad) - e) / (1 - e * Math.cos(E_rad));
  const nu = Math.atan2(sinV, cosV); // true anomaly (radians)

  // True longitude = ν + ω̃ (in radians)
  const wbar_rad = (wbar * Math.PI) / 180;
  const trueLong = nu + wbar_rad;

  return trueLong;
}

/**
 * Compute `initialAngle` for a planet so that at simDays=0 the planet
 * is at its true heliocentric longitude for today's date.
 *
 * The SolarSystem renderer uses: angle = initialAngle - TAU * (simDays / periodDays)
 * At simDays=0, angle = initialAngle. So initialAngle = trueLongitude.
 */
function computeInitialAngle(planetId: string): number {
  return computeTrueLongitude(planetId);
}

// Apply accurate positions to all planets
for (const planet of PLANETS) {
  planet.initialAngle = computeInitialAngle(planet.id);
}

/** Simulation baseline: Earth-days of simulated time per real second at 1× speed. */
export const BASE_DAYS_PER_SEC = 20;

export const SPEED_PRESETS = [0.5, 1, 2, 5, 10, 25];

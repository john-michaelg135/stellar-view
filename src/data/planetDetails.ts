/**
 * Extended detail data for the planet zoom/close-up view.
 * Moons, atmosphere layers, surface features, and visual hints.
 */

export interface MoonDetail {
  name: string;
  radius: number;       // display radius in close-up view
  orbitRadius: number;  // orbit radius in close-up view
  periodDays: number;
  color: string;
  colorDark: string;
  fact?: string;
}

export interface AtmosphereLayer {
  color: string;
  opacity: number;
  radius: number; // multiplier on planet radius (e.g. 1.05 = 5% bigger)
}

export interface SurfaceFeature {
  name: string;
  type: "crater" | "volcano" | "storm" | "icecap" | "spot" | "band" | "ring";
  x: number;  // -1 to 1 relative position
  y: number;
  size: number; // relative size
  color: string;
}

export interface PlanetDetailData {
  id: string;
  moons: MoonDetail[];
  atmosphere: AtmosphereLayer[];
  surfaceFeatures: SurfaceFeature[];
  /** Tilt of the rotation axis in degrees for visual display */
  axialTilt: number;
  /** Whether to show a magnetosphere glow */
  magnetosphere?: boolean;
  /** Ring detail for close-up (extended from the basic ring flag) */
  ringDetail?: {
    innerRadius: number; // multiplier on planet radius
    outerRadius: number;
    color: string;
    opacity: number;
    divisions: number; // number of visible ring gaps
  };
}

export const PLANET_DETAILS: Record<string, PlanetDetailData> = {
  sun: {
    id: "sun",
    moons: [],
    atmosphere: [
      { color: "#ffdd77", opacity: 0.15, radius: 1.25 },
      { color: "#ffaa33", opacity: 0.08, radius: 1.5 },
      { color: "#ff6600", opacity: 0.04, radius: 1.8 },
    ],
    surfaceFeatures: [
      { name: "Sunspot", type: "spot", x: -0.2, y: 0.1, size: 0.08, color: "#cc6600" },
      { name: "Sunspot", type: "spot", x: 0.35, y: -0.15, size: 0.05, color: "#bb5500" },
      { name: "Solar Flare Region", type: "spot", x: 0.6, y: 0.3, size: 0.06, color: "#ff8844" },
    ],
    axialTilt: 7.25,
    magnetosphere: true,
  },
  mercury: {
    id: "mercury",
    moons: [],
    atmosphere: [
      { color: "#b3a08f", opacity: 0.03, radius: 1.02 },
    ],
    surfaceFeatures: [
      { name: "Caloris Basin", type: "crater", x: 0.2, y: -0.1, size: 0.22, color: "#8a7560" },
      { name: "Rachmaninoff", type: "crater", x: -0.35, y: 0.25, size: 0.1, color: "#7a6550" },
      { name: "Debussy", type: "crater", x: 0.45, y: 0.35, size: 0.08, color: "#9a856a" },
      { name: "Hokusai", type: "crater", x: -0.15, y: -0.4, size: 0.07, color: "#c0a888" },
    ],
    axialTilt: 0.03,
  },
  venus: {
    id: "venus",
    moons: [],
    atmosphere: [
      { color: "#fae7b4", opacity: 0.2, radius: 1.08 },
      { color: "#e6c07a", opacity: 0.12, radius: 1.15 },
      { color: "#d4a050", opacity: 0.06, radius: 1.22 },
    ],
    surfaceFeatures: [
      { name: "Ishtar Terra", type: "volcano", x: -0.1, y: -0.5, size: 0.15, color: "#c8a050" },
      { name: "Aphrodite Terra", type: "volcano", x: 0.2, y: 0.1, size: 0.25, color: "#b89040" },
      { name: "Maxwell Montes", type: "volcano", x: 0.0, y: -0.45, size: 0.08, color: "#dab060" },
    ],
    axialTilt: 177.4,
  },
  earth: {
    id: "earth",
    moons: [
      { name: "Moon", radius: 6, orbitRadius: 55, periodDays: 27.32, color: "#c9d3e0", colorDark: "#8a94a8", fact: "Our only natural satellite — its gravitational pull drives Earth's tides." },
    ],
    atmosphere: [
      { color: "#a7d3ff", opacity: 0.12, radius: 1.04 },
      { color: "#7ab8f5", opacity: 0.06, radius: 1.08 },
    ],
    surfaceFeatures: [
      { name: "North Pole", type: "icecap", x: 0.0, y: -0.85, size: 0.18, color: "#e8f4ff" },
      { name: "South Pole", type: "icecap", x: 0.0, y: 0.85, size: 0.15, color: "#dceeff" },
    ],
    axialTilt: 23.44,
    magnetosphere: true,
  },
  mars: {
    id: "mars",
    moons: [
      { name: "Phobos", radius: 3, orbitRadius: 40, periodDays: 0.32, color: "#b09070", colorDark: "#6e5540", fact: "A small, irregular moon slowly spiraling inward — it will crash into Mars or break apart in ~50M years." },
      { name: "Deimos", radius: 2, orbitRadius: 60, periodDays: 1.26, color: "#c8b090", colorDark: "#8a7050", fact: "Mars' smaller, outer moon — so tiny and distant it appears as a bright star from the surface." },
    ],
    atmosphere: [
      { color: "#f5a87b", opacity: 0.06, radius: 1.03 },
      { color: "#d1683f", opacity: 0.03, radius: 1.06 },
    ],
    surfaceFeatures: [
      { name: "Olympus Mons", type: "volcano", x: -0.35, y: -0.1, size: 0.14, color: "#c87850" },
      { name: "Valles Marineris", type: "band", x: 0.1, y: 0.15, size: 0.3, color: "#8b4020" },
      { name: "North Pole", type: "icecap", x: 0.0, y: -0.82, size: 0.2, color: "#f0e8e0" },
      { name: "Hellas Basin", type: "crater", x: 0.3, y: 0.5, size: 0.15, color: "#e8a070" },
    ],
    axialTilt: 25.19,
  },
  jupiter: {
    id: "jupiter",
    moons: [
      { name: "Io", radius: 5, orbitRadius: 48, periodDays: 1.77, color: "#e8d27a", colorDark: "#b8a040", fact: "The most volcanically active body in the solar system — over 400 active volcanoes." },
      { name: "Europa", radius: 4.5, orbitRadius: 62, periodDays: 3.55, color: "#d4c8b8", colorDark: "#9a8e7e", fact: "Beneath its icy crust lies a global ocean with more water than all of Earth's oceans combined." },
      { name: "Ganymede", radius: 7, orbitRadius: 80, periodDays: 7.15, color: "#b8a898", colorDark: "#7a6a5a", fact: "The largest moon in the solar system — bigger than Mercury, with its own magnetic field." },
      { name: "Callisto", radius: 6, orbitRadius: 100, periodDays: 16.69, color: "#8a8070", colorDark: "#5a5040", fact: "The most heavily cratered object in the solar system — its surface hasn't changed in 4 billion years." },
    ],
    atmosphere: [
      { color: "#f4d9ac", opacity: 0.08, radius: 1.03 },
      { color: "#d8a56b", opacity: 0.05, radius: 1.06 },
    ],
    surfaceFeatures: [
      { name: "Great Red Spot", type: "storm", x: 0.3, y: 0.2, size: 0.18, color: "#c65f3d" },
      { name: "North Equatorial Belt", type: "band", x: 0.0, y: -0.25, size: 0.9, color: "#a07040" },
      { name: "South Equatorial Belt", type: "band", x: 0.0, y: 0.25, size: 0.9, color: "#9a6838" },
      { name: "North Tropical Zone", type: "band", x: 0.0, y: -0.45, size: 0.9, color: "#f0d898" },
    ],
    axialTilt: 3.13,
    magnetosphere: true,
  },
  saturn: {
    id: "saturn",
    moons: [
      { name: "Titan", radius: 7, orbitRadius: 90, periodDays: 15.95, color: "#d9b46a", colorDark: "#9a7a3a", fact: "The only moon with a dense atmosphere — with lakes and rivers of liquid methane on its surface." },
      { name: "Enceladus", radius: 3.5, orbitRadius: 55, periodDays: 1.37, color: "#f0f4f8", colorDark: "#b8c0c8", fact: "Geysers at its south pole spray water ice into space — a prime candidate for extraterrestrial life." },
      { name: "Mimas", radius: 2.5, orbitRadius: 42, periodDays: 0.94, color: "#d0c8c0", colorDark: "#908880", fact: "Its giant Herschel crater makes it look like the Death Star from Star Wars." },
      { name: "Rhea", radius: 4, orbitRadius: 72, periodDays: 4.52, color: "#c8c0b8", colorDark: "#888078", fact: "Saturn's second-largest moon — a heavily cratered ice world." },
    ],
    atmosphere: [
      { color: "#f9ecc4", opacity: 0.06, radius: 1.03 },
      { color: "#e3c584", opacity: 0.04, radius: 1.05 },
    ],
    surfaceFeatures: [
      { name: "North Polar Hexagon", type: "storm", x: 0.0, y: -0.7, size: 0.2, color: "#c8a860" },
      { name: "Equatorial Band", type: "band", x: 0.0, y: 0.0, size: 0.9, color: "#d4aa60" },
    ],
    axialTilt: 26.73,
    ringDetail: {
      innerRadius: 1.5,
      outerRadius: 2.4,
      color: "#f2e4b6",
      opacity: 0.85,
      divisions: 4,
    },
  },
  uranus: {
    id: "uranus",
    moons: [
      { name: "Titania", radius: 5, orbitRadius: 60, periodDays: 8.71, color: "#b9cdd6", colorDark: "#7a8e98", fact: "Uranus' largest moon — an icy world with canyons up to 1,500 km long." },
      { name: "Oberon", radius: 4.5, orbitRadius: 78, periodDays: 13.46, color: "#a8b8c0", colorDark: "#687880", fact: "The outermost major moon — heavily cratered with dark material on its floor." },
      { name: "Ariel", radius: 4, orbitRadius: 44, periodDays: 2.52, color: "#d0dce0", colorDark: "#909ca0", fact: "The brightest of Uranus' moons — with a relatively young, lightly cratered surface." },
      { name: "Miranda", radius: 2.5, orbitRadius: 34, periodDays: 1.41, color: "#c0ccd0", colorDark: "#808c90", fact: "A patchwork moon with cliffs 20 km high — it looks like it was shattered and reassembled." },
    ],
    atmosphere: [
      { color: "#dcf6f6", opacity: 0.1, radius: 1.04 },
      { color: "#8fd4d9", opacity: 0.05, radius: 1.08 },
    ],
    surfaceFeatures: [
      { name: "South Polar Cap", type: "icecap", x: 0.0, y: 0.7, size: 0.25, color: "#b8e8e8" },
    ],
    axialTilt: 97.77,
    ringDetail: {
      innerRadius: 1.6,
      outerRadius: 2.0,
      color: "#cdf0f4",
      opacity: 0.4,
      divisions: 2,
    },
  },
  neptune: {
    id: "neptune",
    moons: [
      { name: "Triton", radius: 5.5, orbitRadius: 58, periodDays: 5.88, color: "#cfe0ee", colorDark: "#8a9aaa", fact: "Orbits backwards — likely a captured Kuiper Belt object. Has active geysers of nitrogen gas." },
      { name: "Proteus", radius: 2.5, orbitRadius: 40, periodDays: 1.12, color: "#a0a8b0", colorDark: "#606870", fact: "An irregularly shaped moon — the largest body in the solar system that isn't round." },
    ],
    atmosphere: [
      { color: "#9cb6f5", opacity: 0.1, radius: 1.04 },
      { color: "#4a6fd4", opacity: 0.06, radius: 1.08 },
    ],
    surfaceFeatures: [
      { name: "Great Dark Spot", type: "storm", x: -0.2, y: 0.15, size: 0.16, color: "#283060" },
      { name: "Small Dark Spot", type: "storm", x: 0.3, y: 0.4, size: 0.08, color: "#303868" },
      { name: "South Polar Region", type: "band", x: 0.0, y: 0.6, size: 0.7, color: "#6080c0" },
    ],
    axialTilt: 28.32,
    magnetosphere: true,
  },
};

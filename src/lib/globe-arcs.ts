import type { Position } from "@/components/ui/globe";

const CYAN = "#72DEFE";
const ELECTRIC = "#4CB1FC";
const BLUE = "#2563EB";

const BRASILIA = { lat: -15.79, lng: -47.88 };

const destinations: Array<[number, number, string, number]> = [
  [-23.55, -46.63, CYAN, 0.1], // São Paulo
  [38.72, -9.14, ELECTRIC, 0.28], // Lisboa
  [40.71, -74.01, CYAN, 0.24], // Nova York
  [51.51, -0.13, BLUE, 0.32], // Londres
  [37.77, -122.42, ELECTRIC, 0.34], // São Francisco
  [-34.6, -58.38, BLUE, 0.12], // Buenos Aires
  [52.52, 13.4, CYAN, 0.33], // Berlim
  [-33.92, 18.42, ELECTRIC, 0.26], // Cidade do Cabo
];

/** Conexões secundárias: dão vida ao resto do globo. */
const mesh: Array<[number, number, number, number, string, number]> = [
  [40.71, -74.01, 51.51, -0.13, CYAN, 0.2],
  [51.51, -0.13, 52.52, 13.4, ELECTRIC, 0.1],
  [37.77, -122.42, 35.68, 139.69, BLUE, 0.36],
  [35.68, 139.69, 1.35, 103.82, CYAN, 0.16],
  [1.35, 103.82, 12.97, 77.59, ELECTRIC, 0.14],
  [-33.87, 151.21, 1.35, 103.82, BLUE, 0.22],
  [19.43, -99.13, 40.71, -74.01, ELECTRIC, 0.15],
  [43.65, -79.38, 51.51, -0.13, CYAN, 0.27],
];

export const globeArcs: Position[] = [
  ...destinations.map(([lat, lng, color, alt], i) => ({
    order: (i % 5) + 1,
    startLat: BRASILIA.lat,
    startLng: BRASILIA.lng,
    endLat: lat,
    endLng: lng,
    arcAlt: alt,
    color,
  })),
  ...mesh.map(([sLat, sLng, eLat, eLng, color, alt], i) => ({
    order: (i % 5) + 1,
    startLat: sLat,
    startLng: sLng,
    endLat: eLat,
    endLng: eLng,
    arcAlt: alt,
    color,
  })),
];

export const globeConfig = {
  pointSize: 2,
  globeColor: "#050C3A",
  showAtmosphere: true,
  atmosphereColor: "#4CB1FC",
  atmosphereAltitude: 0.15,
  emissive: "#02040A",
  emissiveIntensity: 0.14,
  shininess: 0.85,
  polygonColor: "rgba(150,216,255,0.78)",
  ambientLight: "#3772CC",
  directionalLeftLight: "#9ad9ff",
  directionalTopLight: "#4CB1FC",
  pointLight: "#72DEFE",
  arcTime: 1600,
  arcLength: 0.85,
  rings: 1,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 0.42,
  hexPolygonResolution: 3,
  fogColor: "#02040a",
} as const;

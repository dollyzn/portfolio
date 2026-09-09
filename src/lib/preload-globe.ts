/** Baixa o chunk do globo e o GeoJSON antes da primeira pintura 3D. */
export function preloadGlobe() {
  void import("@/components/ui/globe");
  void import("@/data/globe.json");
}

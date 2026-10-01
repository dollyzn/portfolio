"use client";

import { useId } from "react";
import { globeArcs } from "@/lib/globe-arcs";
import { cn } from "@/lib/utils";

/**
 * Globo do modo leve: mesma malha de arcos do WebGL, só que projetado em
 * SVG estático. Sem contexto 3D, sem loop de render - o navegador pinta uma
 * vez e esquece.
 */

const R = 86;
const CENTER = 100;
/** Vista centrada em Brasília, com a mesma inclinação da câmera do 3D. */
const VIEW_LAT = 12;
const VIEW_LNG = -47.88;

const RAD = Math.PI / 180;
const sinView = Math.sin(VIEW_LAT * RAD);
const cosView = Math.cos(VIEW_LAT * RAD);

type Projected = { x: number; y: number; visible: boolean };

/** Projeção ortográfica: o hemisfério de frente, como numa foto do globo. */
function project(lat: number, lng: number): Projected {
  const phi = lat * RAD;
  const delta = (lng - VIEW_LNG) * RAD;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  return {
    x: CENTER + R * (cosPhi * Math.sin(delta)),
    y: CENTER - R * (cosView * sinPhi - sinView * cosPhi * Math.cos(delta)),
    visible: sinView * sinPhi + cosView * cosPhi * Math.cos(delta) > 0.02,
  };
}

/** Linhas da malha: só os trechos visíveis viram path. */
function graticule() {
  const paths: string[] = [];

  const add = (points: Projected[]) => {
    let current: string[] = [];
    for (const point of points) {
      if (point.visible) {
        current.push(
          `${current.length ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
        );
      } else if (current.length > 1) {
        paths.push(current.join(" "));
        current = [];
      } else {
        current = [];
      }
    }
    if (current.length > 1) paths.push(current.join(" "));
  };

  for (let lat = -60; lat <= 60; lat += 30) {
    add(Array.from({ length: 73 }, (_, i) => project(lat, -180 + i * 5)));
  }

  for (let lng = -180; lng < 180; lng += 30) {
    add(Array.from({ length: 61 }, (_, i) => project(-90 + i * 3, lng)));
  }

  return paths;
}

const GRATICULE = graticule();

const ARC_COLOR: Record<string, string> = {
  "#72DEFE": "var(--cyan-bright)",
  "#4CB1FC": "var(--electric)",
  "#2563EB": "var(--blue-500)",
};

/** Arco 3D virando bézier: o meio é empurrado para fora do centro. */
const ARCS = globeArcs
  .map((arc, index) => {
    const from = project(arc.startLat, arc.startLng);
    const to = project(arc.endLat, arc.endLng);
    if (!from.visible || !to.visible) return null;

    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = midX - CENTER;
    const dy = midY - CENTER;
    const length = Math.hypot(dx, dy) || 1;
    const lift = R * (0.22 + arc.arcAlt * 1.1);

    return {
      id: `${arc.startLat}-${arc.startLng}-${arc.endLat}-${arc.endLng}-${index}`,
      color: ARC_COLOR[arc.color] ?? "var(--electric)",
      d: `M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${(midX + (dx / length) * lift).toFixed(1)} ${(midY + (dy / length) * lift).toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`,
    };
  })
  .filter((arc): arc is NonNullable<typeof arc> => arc !== null);

/** Pontas dos arcos, sem repetir cidade. */
const POINTS = Array.from(
  new Map(
    globeArcs
      .flatMap((arc) => [
        { lat: arc.startLat, lng: arc.startLng, color: arc.color },
        { lat: arc.endLat, lng: arc.endLng, color: arc.color },
      ])
      .map((point) => [`${point.lat},${point.lng}`, point]),
  ).values(),
)
  .map((point) => ({
    ...point,
    ...project(point.lat, point.lng),
    home: point.lat === -15.79 && point.lng === -47.88,
  }))
  .filter((point) => point.visible);

export function StaticGlobe({ className }: { className?: string }) {
  const uid = useId();
  const sphereId = `${uid}-sphere`;
  const dotsId = `${uid}-dots`;
  const clipId = `${uid}-clip`;

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={cn("size-full", className)}
    >
      <defs>
        <radialGradient id={sphereId} cx="38%" cy="30%" r="82%">
          <stop offset="0%" stopColor="var(--navy-900)" stopOpacity="0.95" />
          <stop offset="60%" stopColor="var(--navy-950)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--abyss)" stopOpacity="0.9" />
        </radialGradient>
        <pattern id={dotsId} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.55" fill="var(--electric)" />
        </pattern>
        <clipPath id={clipId}>
          <circle cx={CENTER} cy={CENTER} r={R} />
        </clipPath>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={R} fill={`url(#${sphereId})`} />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={R}
        fill={`url(#${dotsId})`}
        opacity="0.16"
        clipPath={`url(#${clipId})`}
      />

      <g
        fill="none"
        stroke="var(--electric)"
        strokeOpacity="0.18"
        strokeWidth="0.5"
      >
        {GRATICULE.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <circle
        cx={CENTER}
        cy={CENTER}
        r={R}
        fill="none"
        stroke="var(--cyan-bright)"
        strokeOpacity="0.3"
        strokeWidth="0.7"
      />

      <g fill="none" strokeLinecap="round">
        {ARCS.map((arc) => (
          <path
            key={arc.id}
            d={arc.d}
            stroke={arc.color}
            strokeOpacity="0.5"
            strokeWidth="0.8"
          />
        ))}
      </g>

      <g>
        {POINTS.map((point) => (
          <circle
            key={`${point.lat},${point.lng}`}
            cx={point.x}
            cy={point.y}
            r={point.home ? 2.1 : 1.3}
            fill={point.home ? "var(--cyan-bright)" : "var(--electric)"}
            fillOpacity={point.home ? 1 : 0.75}
          />
        ))}
      </g>
    </svg>
  );
}

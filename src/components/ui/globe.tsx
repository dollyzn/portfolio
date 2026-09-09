"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  Fog,
  Group,
  type MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import ThreeGlobe from "three-globe";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const RING_PROPAGATION_SPEED = 3;
const ASPECT = 1.2;
const CAMERA_Z = 268;

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  hexPolygonResolution?: number;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  fogColor?: string;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
  paused?: boolean;
  onReady?: () => void;
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export function Globe({
  globeConfig,
  data,
  onReady,
}: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<Group | null>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  const [isInitialized, setIsInitialized] = useState(false);

  const config = useMemo(
    () => ({
      pointSize: 1,
      atmosphereColor: "#4CB1FC",
      showAtmosphere: true,
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(114,222,254,0.5)",
      hexPolygonResolution: 3,
      globeColor: "#050C3A",
      emissive: "#02040A",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig],
  );

  useEffect(() => {
    const group = groupRef.current;
    if (globeRef.current || !group) return;
    const globe = new ThreeGlobe();
    globeRef.current = globe;
    group.add(globe);
    setIsInitialized(true);

    return () => {
      group.remove(globe);
      globeRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;
    const material = globeRef.current.globeMaterial() as MeshPhongMaterial;
    material.color = new Color(config.globeColor);
    material.emissive = new Color(config.emissive);
    material.emissiveIntensity = config.emissiveIntensity;
    material.shininess = config.shininess;
  }, [
    isInitialized,
    config.globeColor,
    config.emissive,
    config.emissiveIntensity,
    config.shininess,
  ]);

  // Continentes, arcos e anéis entram em frames separados para o F5
  // não pagar o custo todo de uma vez na thread principal.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !isInitialized || !data) return;

    let cancelled = false;

    globe
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonsData([])
      .arcsData([])
      .pointsData([])
      .ringsData([]);

    const run = async () => {
      await nextFrame();
      if (cancelled) return;

      const geo = (await import("@/data/globe.json")).default as {
        features: object[];
      };
      if (cancelled) return;

      await nextFrame();
      if (cancelled) return;

      globe
        .hexPolygonsData(geo.features)
        .hexPolygonResolution(config.hexPolygonResolution)
        .hexPolygonMargin(0.7)
        .hexPolygonColor(() => config.polygonColor);

      await nextFrame();
      if (cancelled) return;

      const points = data.flatMap((arc) => [
        {
          size: config.pointSize,
          order: arc.order,
          color: arc.color,
          lat: arc.startLat,
          lng: arc.startLng,
        },
        {
          size: config.pointSize,
          order: arc.order,
          color: arc.color,
          lat: arc.endLat,
          lng: arc.endLng,
        },
      ]);

      const uniquePoints = points.filter(
        (point, index, all) =>
          all.findIndex((p) => p.lat === point.lat && p.lng === point.lng) ===
          index,
      );

      globe
        .arcsData(data)
        .arcStartLat((d) => (d as Position).startLat)
        .arcStartLng((d) => (d as Position).startLng)
        .arcEndLat((d) => (d as Position).endLat)
        .arcEndLng((d) => (d as Position).endLng)
        .arcColor((d: object) => (d as Position).color)
        .arcAltitude((d) => (d as Position).arcAlt)
        .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
        .arcDashLength(config.arcLength)
        .arcDashInitialGap((d) => (d as Position).order)
        .arcDashGap(15)
        .arcDashAnimateTime(() => config.arcTime);

      globe
        .pointsData(uniquePoints)
        .pointColor((d) => (d as { color: string }).color)
        .pointsMerge(true)
        .pointAltitude(0)
        .pointRadius(1.1);

      globe
        .ringsData([])
        .ringColor(() => config.polygonColor)
        .ringMaxRadius(config.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod((config.arcTime * config.arcLength) / config.rings);

      onReadyRef.current?.();
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isInitialized, data, config]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !isInitialized || !data.length) return;

    const interval = setInterval(() => {
      if (!globeRef.current) return;
      const picked = pickRandomIndexes(
        data.length,
        Math.max(1, Math.floor((data.length * 4) / 5)),
      );
      globeRef.current.ringsData(
        data
          .filter((_, i) => picked.includes(i))
          .map((d) => ({ lat: d.startLat, lng: d.startLng, color: d.color })),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}

export function World({
  globeConfig,
  data,
  paused = false,
  onReady,
}: WorldProps) {
  const [finePointer] = useState(
    () => window.matchMedia("(pointer: fine)").matches,
  );
  const [motionOk] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const scene = useMemo(() => {
    const next = new Scene();
    next.fog = new Fog(
      new Color(globeConfig.fogColor ?? "#02040a").getHex(),
      CAMERA_Z + 40,
      CAMERA_Z + 300,
    );
    return next;
  }, [globeConfig.fogColor]);

  const camera = useMemo(() => {
    const cam = new PerspectiveCamera(50, ASPECT, 100, 2000);
    cam.position.set(0, CAMERA_Z * 0.623, CAMERA_Z * 0.782);
    cam.lookAt(0, 0, 0);
    return cam;
  }, []);

  const resolvedConfig = useMemo(
    () => ({
      ...globeConfig,
      // resolução 3 gera um long-task de ~500ms no F5; 2 ainda desenha
      // os continentes com clareza e deixa a thread principal respirar
      hexPolygonResolution: globeConfig.hexPolygonResolution ?? 2,
    }),
    [globeConfig],
  );

  return (
    <Canvas
      scene={scene}
      camera={camera}
      dpr={[1, 1.5]}
      gl={(props) => {
        const renderer = new WebGLRenderer({
          ...props,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);
        return renderer;
      }}
      frameloop={paused ? "never" : motionOk ? "always" : "demand"}
      style={{ touchAction: "none" }}
    >
      <ambientLight color={globeConfig.ambientLight} intensity={0.65} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.85}
      />
      <Globe
        globeConfig={resolvedConfig}
        data={data}
        onReady={onReady}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={finePointer ? 0.45 : 0.7}
        minDistance={CAMERA_Z}
        maxDistance={CAMERA_Z}
        autoRotate={motionOk && globeConfig.autoRotate !== false}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 0.42}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  const expanded = hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => `${r}${r}${g}${g}${b}${b}`,
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function pickRandomIndexes(max: number, count: number) {
  const picked: number[] = [];
  const target = Math.min(count, max);
  while (picked.length < target) {
    const value = Math.floor(Math.random() * max);
    if (!picked.includes(value)) picked.push(value);
  }
  return picked;
}

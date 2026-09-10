"use client";

/**
 * THE SPREAD — nine odometer readings as one physical object.
 *
 * The floor has no type. Nine reachable listings run from a 2006 Mercedes S500
 * at 170,000 km to a 2025 Skoda Kodiaq at 9,000 km: 9,000–175,000 km across
 * nineteen model years, with nothing clustered. That is the argument, so the
 * geometry carries it literally rather than illustrating it:
 *
 *   X (position along the axis) = the TRUE proportional odometer reading.
 *     No compression, no even spacing, no jitter. The gaps in the arrangement
 *     are the gaps in the real inventory.
 *   Y (pin height)              = the model year, 2006 shortest → 2025 tallest.
 *
 * Two dimensions of published data and nothing invented. Read together they
 * show the thing a list cannot: age and mileage do not track each other here —
 * a 2020 BMW at 155,000 km stands short and far right, a 2023 C200 stands tall
 * and far left.
 *
 * Colour is rationed exactly as the page rations it: one marker in --sold red
 * (the E200, the single car with their own 🚨SOLD🚨 banner), one gold cap (the
 * Kodiaq, the single listing that states a price), every other marker bone.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useWebglHealth } from "@/lib/use-webgl-health";

/* ---------------------------------------------------------------- types -- */

export type SpreadCar = {
  id: string;
  label: string;
  km: number;
  year: number;
  sold: boolean;
  priced: boolean;
};

/* ------------------------------------------------------------ constants -- */

const INK = "#F6F1E9";
const MUTED = "#D6C6B2";
const PANEL = "#241811";
const PANEL_2 = "#322317";
const GOLD = "#C9A24B";
const SOLD = "#C0202B";
const BONE = "#E4D8C6";

/** Half-length of the axis in world units; the bar runs -HALF … +HALF on X. */
const AXIS_HALF = 4.4;
/** Shortest pin (oldest car) and tallest pin (newest car), in world units. */
const PIN_MIN = 0.5;
const PIN_MAX = 2.0;
/** Top face of the axis bar — every pin stands on this. */
const BAR_TOP = 0.06;
/** Every 25,000 km gets a transverse rule under the bar. */
const TICK_STEP = 25000;

const KM_FMT = new Intl.NumberFormat("en-US");

/* ------------------------------------------------------------- mappings -- */

type Domain = { kmMin: number; kmMax: number; yearMin: number; yearMax: number };

function domainOf(cars: SpreadCar[]): Domain {
  if (cars.length === 0) {
    return { kmMin: 0, kmMax: 1, yearMin: 0, yearMax: 1 };
  }
  const kms = cars.map((c) => c.km);
  const years = cars.map((c) => c.year);
  return {
    kmMin: Math.min(...kms),
    kmMax: Math.max(...kms),
    yearMin: Math.min(...years),
    yearMax: Math.max(...years),
  };
}

/** Odometer → world X. Linear and uncompressed: the real spacing survives. */
function kmToX(km: number, d: Domain): number {
  const span = d.kmMax - d.kmMin || 1;
  return ((km - d.kmMin) / span) * (AXIS_HALF * 2) - AXIS_HALF;
}

/** Model year → pin height. 2006 is shortest, 2025 is tallest. */
function yearToHeight(year: number, d: Domain): number {
  const span = d.yearMax - d.yearMin || 1;
  return PIN_MIN + ((year - d.yearMin) / span) * (PIN_MAX - PIN_MIN);
}

/* ------------------------------------------------------------- geometry -- */

/**
 * The instrument grid: longitudinal rules along the axis plus one transverse
 * rule at every 25,000 km. Built once as raw line segments — a hand-rolled
 * BufferGeometry rather than a helper, so the extents match a subject that is
 * wide and shallow instead of square.
 */
function useGridGeometry(d: Domain): THREE.BufferGeometry {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    const depth = 1.5;

    // Longitudinal rules (running with the axis).
    for (let i = -3; i <= 3; i += 1) {
      const z = (i / 3) * depth;
      pts.push(-AXIS_HALF - 0.5, 0, z, AXIS_HALF + 0.5, 0, z);
    }

    // Transverse rules at each 25,000 km tick inside the published range.
    const first = Math.ceil(d.kmMin / TICK_STEP) * TICK_STEP;
    for (let km = first; km <= d.kmMax; km += TICK_STEP) {
      const x = kmToX(km, d);
      pts.push(x, 0, -depth, x, 0, depth);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [d]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return geometry;
}

/* ---------------------------------------------------------------- marker -- */

type MarkerProps = {
  car: SpreadCar;
  domain: Domain;
  isSelected: boolean;
  reduced: boolean;
  onSelect: (id: string) => void;
  /** Suppresses the click that ends a drag. */
  draggedRef: RefObject<boolean>;
};

function Marker({
  car,
  domain,
  isSelected,
  reduced,
  onSelect,
  draggedRef,
}: MarkerProps): ReactElement {
  const x = kmToX(car.km, domain);
  const height = yearToHeight(car.year, domain);

  const groupRef = useRef<THREE.Group>(null);
  const stemRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const colour = car.sold ? SOLD : BONE;
  const emissive = car.sold ? SOLD : GOLD;

  useFrame((_, delta) => {
    const group = groupRef.current;
    const stem = stemRef.current;
    if (!group || !stem) return;

    // Selected marker rises off the bar and brightens; hover nudges it too.
    const lift = isSelected ? 0.34 : hovered ? 0.12 : 0;
    const glow = isSelected ? 0.5 : hovered ? 0.2 : 0.045;

    if (reduced) {
      group.position.y = BAR_TOP + lift;
    } else {
      const k = 1 - Math.pow(0.0016, delta);
      group.position.y += (BAR_TOP + lift - group.position.y) * k;
    }

    const mat = stem.material as THREE.MeshStandardMaterial;
    const step = reduced ? 1 : Math.min(1, delta * 7);
    mat.emissiveIntensity += (glow - mat.emissiveIntensity) * step;
  });

  return (
    <group
      ref={groupRef}
      position={[x, BAR_TOP, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (draggedRef.current) return;
        onSelect(car.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Stem. A cylinder's axis is +Y by default, which is already upright —
          no rotation, nothing to guess at. Unit height, scaled on Y. */}
      <mesh
        ref={stemRef}
        position={[0, height / 2, 0]}
        scale={[1, height, 1]}
        castShadow={false}
      >
        <cylinderGeometry args={[0.055, 0.075, 1, 18]} />
        <meshStandardMaterial
          color={colour}
          emissive={emissive}
          emissiveIntensity={0.045}
          roughness={0.42}
          metalness={0.18}
        />
      </mesh>

      {/* Head disc — the weight at the top of the marker. */}
      <mesh position={[0, height + 0.035, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.07, 28]} />
        <meshStandardMaterial
          color={colour}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.34 : 0.05}
          roughness={0.34}
          metalness={0.3}
        />
      </mesh>

      {/* The single priced listing carries a gold cap. Nothing else does. */}
      {car.priced ? (
        <mesh position={[0, height + 0.105, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.045, 28]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.42}
            roughness={0.24}
            metalness={0.66}
          />
        </mesh>
      ) : null}

      {/* Foot: seats the pin on the bar so it reads as standing, not floating. */}
      <mesh position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.036, 20]} />
        <meshStandardMaterial color={PANEL_2} roughness={0.85} metalness={0.1} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------ the scene -- */

type SceneProps = {
  cars: SpreadCar[];
  domain: Domain;
  selected: string;
  reduced: boolean;
  onSelect: (id: string) => void;
  yawRef: RefObject<number>;
  draggedRef: RefObject<boolean>;
};

function Scene({
  cars,
  domain,
  selected,
  reduced,
  onSelect,
  yawRef,
  draggedRef,
}: SceneProps): ReactElement {
  const axisRef = useRef<THREE.Group>(null);
  const grid = useGridGeometry(domain);

  const selectedX = useMemo(() => {
    const car = cars.find((c) => c.id === selected);
    return car ? kmToX(car.km, domain) : 0;
  }, [cars, domain, selected]);

  // The camera is read off the frame state rather than captured during render,
  // so nothing declared in render scope is mutated in the loop.
  useFrame((state, delta) => {
    const k = reduced ? 1 : 1 - Math.pow(0.002, delta);
    const cam = state.camera;

    // Drag rotates the whole arrangement so its depth reads. Clamped upstream.
    const axis = axisRef.current;
    if (axis) axis.rotation.y += (yawRef.current - axis.rotation.y) * k;

    // The camera eases only very slightly toward the selected marker — enough
    // to acknowledge it, never enough to lose the full span from frame.
    const targetX = selectedX * 0.3;
    cam.position.x += (targetX - cam.position.x) * k;
    cam.lookAt(selectedX * 0.14, 0.92, 0);
  });

  return (
    <>
      <color attach="background" args={[PANEL]} />
      <fog attach="fog" args={[PANEL, 9, 20]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={[INK, PANEL_2, 0.5]} />
      <directionalLight position={[3.5, 6, 5]} intensity={1.35} />
      <directionalLight position={[-5, 2.5, -3]} intensity={0.4} color={GOLD} />

      <group ref={axisRef}>
        {/* Ground. A plane's face points +Z, so -90° about X lays it flat. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]}>
          <planeGeometry args={[AXIS_HALF * 2 + 3.4, 5.4]} />
          <meshStandardMaterial color={PANEL_2} roughness={1} metalness={0} />
        </mesh>

        <lineSegments geometry={grid} position={[0, 0.002, 0]}>
          <lineBasicMaterial color={MUTED} transparent opacity={0.16} />
        </lineSegments>

        {/* The axis itself: one thin bar, every marker strung along it. */}
        <mesh position={[0, BAR_TOP / 2, 0]}>
          <boxGeometry args={[AXIS_HALF * 2 + 0.5, BAR_TOP, 0.3]} />
          <meshStandardMaterial color={BONE} roughness={0.55} metalness={0.22} />
        </mesh>

        {cars.map((car) => (
          <Marker
            key={car.id}
            car={car}
            domain={domain}
            isSelected={car.id === selected}
            reduced={reduced}
            onSelect={onSelect}
            draggedRef={draggedRef}
          />
        ))}
      </group>
    </>
  );
}

/* ------------------------------------------------------------- fallback -- */

function SpreadFallback({
  cars,
  selected,
  onSelect,
  note,
}: {
  cars: SpreadCar[];
  selected: string;
  onSelect: (id: string) => void;
  note: string;
}): ReactElement {
  const sorted = [...cars].sort((a, b) => a.km - b.km);
  return (
    <div
      className="w-full rounded-sm border p-4 sm:p-6"
      style={{ borderColor: "rgba(214,198,178,0.22)", background: PANEL }}
    >
      <p
        className="mb-4 text-[0.68rem] uppercase tracking-[0.22em]"
        style={{ color: GOLD }}
      >
        {note}
      </p>
      <ul className="grid gap-px" style={{ background: "rgba(214,198,178,0.14)" }}>
        {sorted.map((car) => (
          <li key={car.id} style={{ background: PANEL }}>
            <button
              type="button"
              onClick={() => onSelect(car.id)}
              aria-pressed={car.id === selected}
              className="flex w-full items-baseline justify-between gap-4 px-2 py-2 text-left"
              style={{ color: car.id === selected ? INK : MUTED }}
            >
              <span className="text-sm">
                {car.label}
                {car.sold ? (
                  <span className="ml-2 text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: SOLD }}>
                    sold
                  </span>
                ) : null}
                {car.priced ? (
                  <span className="ml-2 text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                    priced
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-xs">
                {car.year} · {KM_FMT.format(car.km)} km
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- export -- */

export function Spread({
  cars,
  selected,
  onSelect,
  hint,
}: {
  cars: { id: string; label: string; km: number; year: number; sold: boolean; priced: boolean }[];
  selected: string;
  onSelect: (id: string) => void;
  hint: string;
}): ReactElement {
  const { lost, bind } = useWebglHealth();

  // Support probe. A throwaway canvas is the only honest test; the state write
  // happens once, in an effect, because there is no way to ask before mount.
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    let ok = false;
    try {
      const probe = document.createElement("canvas");
      ok = Boolean(
        probe.getContext("webgl2") ||
          probe.getContext("webgl") ||
          probe.getContext("experimental-webgl")
      );
    } catch {
      ok = false;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(ok);
  }, []);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mql.matches);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mql.matches);
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  const domain = useMemo(() => domainOf(cars), [cars]);
  const ordered = useMemo(() => [...cars].sort((a, b) => a.km - b.km), [cars]);

  // Drag state. Owned here, read by the scene; never a ref handed in as a prop.
  const wrapRef = useRef<HTMLDivElement>(null);
  const yawRef = useRef(0);
  const draggedRef = useRef(false);
  const dragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const YAW_CLAMP = 0.45;

    const onDown = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      // Hit-test the canvas rect: the listeners live on window so a drag that
      // leaves the element still tracks, but only a press inside starts one.
      const r = el.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        return;
      }
      dragging.current = true;
      draggedRef.current = false;
      lastX.current = e.clientX;
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      if (Math.abs(dx) > 1) draggedRef.current = true;
      const next = yawRef.current + dx * 0.005;
      yawRef.current = Math.max(-YAW_CLAMP, Math.min(YAW_CLAMP, next));
    };

    const onUp = () => {
      dragging.current = false;
      // Let the click that ends a drag land first, then re-arm selection.
      window.setTimeout(() => {
        draggedRef.current = false;
      }, 0);
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const handleCreated = useCallback(
    ({ gl, camera }: { gl: THREE.WebGLRenderer; camera: THREE.Camera }) => {
      bind(gl.domElement);
      // The camera is elevated and off-axis. r3f keeps its default
      // look-down-minus-Z rotation regardless of position, so without this the
      // canvas renders an empty ground colour and nothing else.
      camera.lookAt(0, 0.92, 0);
    },
    [bind]
  );

  const showCanvas = supported === true && !lost;

  return (
    <div className="w-full">
      {/* Positioning lives on this wrapper, never on <Canvas> itself. */}
      <div
        ref={wrapRef}
        className="relative w-full touch-pan-y select-none overflow-hidden rounded-sm"
        style={{ background: PANEL, cursor: showCanvas ? "grab" : "default" }}
      >
        {showCanvas ? (
          <div className="relative aspect-[5/2] w-full">
            <Canvas
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
              camera={{ position: [0, 3.5, 7.4], fov: 34, near: 0.1, far: 60 }}
              onCreated={handleCreated}
            >
              <Scene
                cars={cars}
                domain={domain}
                selected={selected}
                reduced={reduced}
                onSelect={onSelect}
                yawRef={yawRef}
                draggedRef={draggedRef}
              />
            </Canvas>
          </div>
        ) : (
          <SpreadFallback
            cars={cars}
            selected={selected}
            onSelect={onSelect}
            note={
              lost
                ? "Graphics context dropped — the nine readings, in full"
                : "The nine readings, in full"
            }
          />
        )}
      </div>

      {/* The primary selector is HTML, in odometer order: crisp, focusable,
          announced, and readable with no canvas at all. */}
      <div
        role="group"
        aria-label="Nine listings by published odometer"
        className="mt-4 flex flex-wrap gap-px"
        style={{ background: "rgba(214,198,178,0.16)" }}
      >
        {ordered.map((car) => {
          const active = car.id === selected;
          return (
            <button
              key={car.id}
              type="button"
              onClick={() => onSelect(car.id)}
              aria-pressed={active}
              className="flex-1 basis-[8.5rem] px-3 py-2 text-left transition-colors"
              style={{
                background: active ? PANEL_2 : PANEL,
                color: active ? INK : MUTED,
                boxShadow: active ? `inset 0 2px 0 0 ${car.sold ? SOLD : car.priced ? GOLD : BONE}` : "none",
              }}
            >
              <span className="block truncate text-[0.78rem] leading-tight">
                {car.label}
              </span>
              <span className="mt-1 block tabular-nums text-[0.68rem] tracking-[0.06em]" style={{ color: active ? MUTED : "rgba(214,198,178,0.72)" }}>
                {car.year} · {KM_FMT.format(car.km)} km
              </span>
            </button>
          );
        })}
      </div>

      <p
        className="mt-3 text-[0.7rem] leading-relaxed"
        style={{ color: MUTED }}
      >
        {hint}
      </p>
    </div>
  );
}

export default Spread;

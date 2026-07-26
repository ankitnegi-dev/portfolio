"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import * as THREE from "three";

type NodeDef = {
  id: string;
  label: string;
  position: [number, number, number];
  primary?: boolean;
};

const nodes: NodeDef[] = [
  { id: "orchestrator", label: "orchestrator", position: [0, 1.3, 0], primary: true },
  { id: "listener", label: "listener agent", position: [-1.9, -0.3, 0.4] },
  { id: "drafting", label: "drafting agent", position: [1.9, -0.3, -0.4] },
  { id: "review", label: "HITL review", position: [0, -1.7, 0] },
];

const edges: [string, string][] = [
  ["orchestrator", "listener"],
  ["orchestrator", "drafting"],
  ["orchestrator", "review"],
  ["listener", "review"],
  ["drafting", "review"],
];

const ACCENT = "#4c8dff";
const ACCENT_WARM = "#ff6b4a";
const NODE_COLOR = "#181d22";
const EDGE_COLOR = "#2e343b";
const PULSE_COLORS = ["#4c8dff", "#7f77dd", "#ff6b4a"];

function Node({ node }: { node: NodeDef }) {
  return (
    <group position={node.position}>
      <mesh>
        <sphereGeometry args={[node.primary ? 0.22 : 0.16, 24, 24]} />
        <meshStandardMaterial
          color={node.primary ? ACCENT : NODE_COLOR}
          emissive={node.primary ? ACCENT : "#000000"}
          emissiveIntensity={node.primary ? 0.4 : 0}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, node.primary ? -0.42 : -0.34, 0]}
        fontSize={0.14}
        color="#e6e8eb"
        anchorX="center"
        anchorY="top"
      >
        {node.label}
      </Text>
    </group>
  );
}

function Edge({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const points = useMemo(
    () => [new THREE.Vector3(...from), new THREE.Vector3(...to)],
    [from, to]
  );
  return <Line points={points} color={EDGE_COLOR} lineWidth={1} />;
}

function Pulse({
  from,
  to,
  speed,
  offset,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  speed: number;
  offset: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const start = useMemo(() => new THREE.Vector3(...from), [from]);
  const end = useMemo(() => new THREE.Vector3(...to), [to]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 1;
    ref.current.position.lerpVectors(start, end, t);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Graph({
  pointer,
  reduceMotion,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  reduceMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (reduceMotion) {
      groupRef.current.rotation.set(0, 0, 0);
      return;
    }

    // target rotation derived from cursor position (small range: ~0.18 rad)
    const targetY = pointer.current.x * 0.18;
    const targetX = pointer.current.y * -0.12;

    // damped approach instead of a snap — weighted drift, not instant tracking
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetY,
      4,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetX,
      4,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      {edges.map(([a, b]) => (
        <Edge key={`${a}-${b}`} from={byId[a].position} to={byId[b].position} />
      ))}
      {edges.map(([a, b], i) => (
        <Pulse
          key={`pulse-${a}-${b}`}
          from={byId[a].position}
          to={byId[b].position}
          speed={0.18 + (i % 3) * 0.05}
          offset={i * 0.2}
          color={PULSE_COLORS[i % PULSE_COLORS.length]}
        />
      ))}
      {nodes.map((n) => (
        <Node key={n.id} node={n} />
      ))}
    </group>
  );
}

// Tracks normalized pointer position over the canvas element and writes it
// into a ref (not state) so mouse movement never triggers a React re-render —
// useFrame reads the ref directly on the render loop instead.
function PointerTracker({ target }: { target: React.RefObject<{ x: number; y: number }> }) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    function onMove(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      target.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      target.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }

    function onLeave() {
      target.current.x = 0;
      target.current.y = 0;
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, target]);

  return null;
}

export function AgentGraph3D() {
  const pointer = useRef({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(
  () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
);

useEffect(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => setReduceMotion(mq.matches);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);

  return (
    <div className="not-prose rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4 my-8">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          techdesk-ai / agent graph
        </span>
        <span className="font-mono text-[11px] text-[var(--accent)]">live</span>
      </div>
      <div className="h-[320px] rounded-[var(--radius-sm)] overflow-hidden">
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
              loading graph…
            </div>
          }
        >
          <Canvas camera={{ position: [0, 0.4, 5], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 3, 3]} intensity={40} color={ACCENT} />
            <pointLight position={[-3, -2, 2]} intensity={20} color={ACCENT_WARM} />
            <PointerTracker target={pointer} />
            <Graph pointer={pointer} reduceMotion={reduceMotion} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate={false}
              minPolarAngle={Math.PI / 2.6}
              maxPolarAngle={Math.PI / 1.6}
            />
          </Canvas>
        </Suspense>
      </div>
      <div className="border-t border-[var(--border)] mt-3 pt-2 flex justify-between font-mono text-[11px] text-[var(--text-muted)]">
        <span>drag to rotate</span>
        <span>kafka event bus · redis bandit tracker</span>
      </div>
    </div>
  );
}
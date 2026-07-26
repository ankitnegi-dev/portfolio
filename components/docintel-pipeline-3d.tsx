"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import * as THREE from "three";

type NodeDef = {
  id: string;
  label: string;
  position: [number, number, number];
  primary?: boolean;
};

const nodes: NodeDef[] = [
  { id: "document", label: "PDF input", position: [-2.6, 0, 0] },
  { id: "ingestion", label: "OCR + classify", position: [-1.4, 0, 0] },
  { id: "vector", label: "vector search", position: [-0.1, 0.9, 0] },
  { id: "bm25", label: "BM25", position: [-0.1, -0.9, 0] },
  { id: "fusion", label: "RRF fusion", position: [1.1, 0, 0] },
  { id: "rerank", label: "cross-encoder rerank", position: [2.3, 0, 0] },
  { id: "answer", label: "cited answer", position: [3.5, 0, 0], primary: true },
];

const edges: [string, string][] = [
  ["document", "ingestion"],
  ["ingestion", "vector"],
  ["ingestion", "bm25"],
  ["vector", "fusion"],
  ["bm25", "fusion"],
  ["fusion", "rerank"],
  ["rerank", "answer"],
];

const ACCENT = "#4c8dff";
const NODE_COLOR = "#181d22";
const EDGE_COLOR = "#2e343b";
const PULSE_COLORS = ["#4c8dff", "#7f77dd", "#ff6b4a"];

function Node({ node }: { node: NodeDef }) {
  return (
    <group position={node.position}>
      <mesh>
        <sphereGeometry args={[node.primary ? 0.2 : 0.14, 24, 24]} />
        <meshStandardMaterial
          color={node.primary ? ACCENT : NODE_COLOR}
          emissive={node.primary ? ACCENT : "#000000"}
          emissiveIntensity={node.primary ? 0.4 : 0}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, node.primary ? -0.38 : -0.3, 0]}
        fontSize={0.12}
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
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Pipeline() {
  const groupRef = useRef<THREE.Group>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // same gentle ambient sway as the agent graph's original idle state -
    // this one stays passive/idle rather than cursor-driven, since it's
    // a supporting diagram inside prose, not a hero element
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.12) * 0.1;
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
          speed={0.22 + (i % 3) * 0.05}
          offset={i * 0.15}
          color={PULSE_COLORS[i % PULSE_COLORS.length]}
        />
      ))}
      {nodes.map((n) => (
        <Node key={n.id} node={n} />
      ))}
    </group>
  );
}

export function DocIntelPipeline3D() {
  return (
    <div className="not-prose rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4 my-8">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          docintel / retrieval pipeline
        </span>
        <span className="font-mono text-[11px] text-[var(--accent)]">live</span>
      </div>
      <div className="h-[300px] rounded-[var(--radius-sm)] overflow-hidden">
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
              loading pipeline…
            </div>
          }
        >
          <Canvas camera={{ position: [0.5, 0.3, 5.5], fov: 42 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 3, 3]} intensity={40} color={ACCENT} />
            <Pipeline />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 2.6}
              maxPolarAngle={Math.PI / 1.6}
            />
          </Canvas>
        </Suspense>
      </div>
      <div className="border-t border-[var(--border)] mt-3 pt-2 flex justify-between font-mono text-[11px] text-[var(--text-muted)]">
        <span>drag to rotate</span>
        <span>chromadb · bm25 · reciprocal rank fusion</span>
      </div>
    </div>
  );
}
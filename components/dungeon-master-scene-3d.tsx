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
  { id: "capture", label: "camera capture", position: [-2.8, 0, 0] },
  { id: "vision", label: "Groq vision", position: [-1.5, 0, 0] },
  { id: "narration", label: "DM narration", position: [-0.2, 0, 0] },
  { id: "image", label: "FLUX.1 scene art", position: [1.2, 1.0, 0] },
  { id: "voice", label: "ElevenLabs voice", position: [1.2, 0, 0] },
  { id: "multiplayer", label: "Pusher sync", position: [1.2, -1.0, 0] },
  { id: "scene", label: "live scene", position: [2.6, 0, 0], primary: true },
];

const edges: [string, string][] = [
  ["capture", "vision"],
  ["vision", "narration"],
  ["narration", "image"],
  ["narration", "voice"],
  ["narration", "multiplayer"],
  ["image", "scene"],
  ["voice", "scene"],
  ["multiplayer", "scene"],
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
        fontSize={0.11}
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

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
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
          speed={0.2 + (i % 3) * 0.05}
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

export function DungeonMasterScene3D() {
  return (
    <div className="not-prose rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4 my-8">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          ai-dungeon-master / vision pipeline
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
          <Canvas camera={{ position: [0, 0.2, 6], fov: 42 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 3, 3]} intensity={40} color={ACCENT} />
            <Scene />
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
        <span>groq llama 4 scout · flux.1 · elevenlabs · pusher</span>
      </div>
    </div>
  );
}
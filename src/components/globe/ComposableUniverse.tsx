"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { GLOBE_NODES } from "@/lib/data";
import { latLngToVec3 } from "@/lib/utils";

/**
 * The Composable Universe:
 *   - Wireframe Earth
 *   - Solid inner core (so wireframe looks like a globe, not a cage)
 *   - Pulsing electric-blue data nodes at client cities
 *   - Curved Bezier arcs connecting them
 *   - Particle/star field background
 *   - Mouse-reactive parallax tilt
 *   - Slow auto-rotation
 *   - Scroll affects rotation speed (handled by parent if used)
 */

interface Props {
  /** Smaller, simpler version for footer/secondary placements */
  variant?: "hero" | "footer";
  /** Show city labels on hover */
  interactive?: boolean;
  className?: string;
}

const RADIUS = 2;

function Earth({ variant }: { variant: "hero" | "footer" }) {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  // Auto-rotate + mouse-reactive tilt
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (variant === "hero" ? 0.06 : 0.04);
      // Parallax: ease toward mouse target
      const targetX = mouse.y * 0.25;
      const targetY = mouse.x * 0.25;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.position.y = Math.sin(Date.now() * 0.0004) * 0.04;
    }
    if (atmosphereRef.current) {
      const m = atmosphereRef.current.material as THREE.ShaderMaterial;
      if (m.uniforms?.uTime) m.uniforms.uTime.value += delta;
    }
  });

  // Curved arcs between nodes (reduced for perf)
  const arcs = useMemo(() => {
    const result: { points: THREE.Vector3[]; color: string }[] = [];
    const max = variant === "hero" ? Math.min(8, GLOBE_NODES.length) : Math.min(5, GLOBE_NODES.length);
    for (let i = 0; i < max; i++) {
      const a = GLOBE_NODES[i];
      const b = GLOBE_NODES[(i + 3) % GLOBE_NODES.length];
      const va = new THREE.Vector3(...latLngToVec3(a.lat, a.lng, RADIUS));
      const vb = new THREE.Vector3(...latLngToVec3(b.lat, b.lng, RADIUS));
      const mid = va.clone().lerp(vb, 0.5);
      // lift the midpoint outward proportional to chord length
      const lift = 0.4 + va.distanceTo(vb) * 0.45;
      mid.normalize().multiplyScalar(RADIUS + lift);
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      result.push({ points: curve.getPoints(48), color: "#0052ff" });
    }
    return result;
  }, [variant]);

  // Atmosphere shader (Fresnel rim) — toned WAY down for the matte black aesthetic
  const atmosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#0052ff") },
          uIntensity: { value: variant === "hero" ? 0.55 : 0.35 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPos;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPos = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPos;
          uniform vec3 uColor;
          uniform float uIntensity;
          uniform float uTime;
          void main() {
            vec3 viewDir = normalize(vViewPos);
            float fres = pow(1.0 - dot(viewDir, normalize(vNormal)), 2.5);
            float pulse = 0.85 + 0.15 * sin(uTime * 1.5);
            vec3 col = uColor * fres * uIntensity * pulse;
            gl_FragColor = vec4(col, fres);
          }
        `,
      }),
    [variant],
  );

  return (
    <group ref={groupRef}>
      {/* Inner solid sphere — keeps wireframe looking like a planet */}
      <mesh>
        <sphereGeometry args={[RADIUS - 0.01, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Wireframe shell — soft white instead of blue, lower opacity */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[RADIUS, 32, 24]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Atmosphere rim glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[RADIUS * 1.18, 64, 64]} />
        <primitive object={atmosphereMat} attach="material" />
      </mesh>

      {/* Lat/Lng equator + tropics */}
      {[0, 22.5, -22.5, 45, -45, 66.5, -66.5].map((lat) => (
        <Latitude key={`lat-${lat}`} lat={lat} radius={RADIUS} />
      ))}

      {/* Data nodes */}
      {GLOBE_NODES.map((n, i) => {
        const pos = latLngToVec3(n.lat, n.lng, RADIUS + 0.01);
        return (
          <DataNode
            key={n.city}
            position={pos}
            node={n}
            delay={i * 0.18}
            variant={variant}
          />
        );
      })}

      {/* Connection arcs */}
      {arcs.map((arc, i) => (
        <ArcLine key={`arc-${i}`} points={arc.points} color={arc.color} />
      ))}

      {/* Outer orbital ring — subtler */}
      {variant === "hero" && (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[RADIUS * 1.55, 0.0035, 16, 200]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      )}
    </group>
  );
}

function Latitude({ lat, radius }: { lat: number; radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const lng = (i / segments) * 360 - 180;
      pts.push(new THREE.Vector3(...latLngToVec3(lat, lng, radius)));
    }
    return pts;
  }, [lat, radius]);

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color="#ffffff" transparent opacity={0.07} />
    </line>
  );
}

function ArcLine({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const ref = useRef<THREE.Line>(null);
  const dashRef = useRef<{ progress: number }>({ progress: 0 });

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const mat = useMemo(
    () =>
      new THREE.LineDashedMaterial({
        color,
        transparent: true,
        opacity: 0.55,
        dashSize: 0.06,
        gapSize: 0.04,
      }),
    [color],
  );

  useEffect(() => {
    if (ref.current) ref.current.computeLineDistances();
  }, []);

  useFrame((_, delta) => {
    dashRef.current.progress += delta * 0.5;
    if (mat) {
      mat.dashSize = 0.06 + Math.sin(dashRef.current.progress) * 0.01;
    }
  });

  return (
    <line ref={ref as never}>
      <primitive object={geom} attach="geometry" />
      <primitive object={mat} attach="material" />
    </line>
  );
}

function DataNode({
  position,
  node,
  delay,
  variant,
}: {
  position: [number, number, number];
  node: (typeof GLOBE_NODES)[number];
  delay: number;
  variant: "hero" | "footer";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const t = (Date.now() * 0.001 + delay) % 2;
      const s = 1 + Math.sin(t * Math.PI) * 0.4;
      meshRef.current.scale.setScalar(s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
      const t = ((Date.now() * 0.001 + delay) % 3) / 3;
      const s = 1 + t * 1.5;
      ringRef.current.scale.setScalar(s);
      const m = ringRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.5 - t * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* core */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#4f86ff" toneMapped={false} />
      </mesh>
      {/* halo */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.025, 0.04, 32]} />
        <meshBasicMaterial color="#0052ff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* HUD label on hover */}
      {hovered && variant === "hero" && (
        <Html
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
          zIndexRange={[10, 0]}
        >
          <div className="whitespace-nowrap rounded-md border border-electric/40 bg-ink-100/95 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-bone backdrop-blur shadow-glow-sm">
            <div className="text-electric">{node.city}</div>
            {node.client && <div className="mt-0.5 text-white/70">{node.client}</div>}
            {node.metric && <div className="mt-0.5 text-white/40">{node.metric}</div>}
          </div>
        </Html>
      )}
    </group>
  );
}

function ScrollSpeedRig() {
  const { camera } = useThree();
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const limit = 1200;
      const t = Math.min(1, y / limit);
      camera.position.z = 6 + t * 1.2;
      camera.position.y = -t * 0.6;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [camera]);
  return null;
}

export default function ComposableUniverse({
  variant = "hero",
  interactive = true,
  className,
}: Props) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        frameloop={variant === "hero" ? "always" : "demand"}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 14]} />

        <ambientLight intensity={0.4} />
        <pointLight position={[5, 3, 5]} intensity={0.8} color="#0052ff" />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#ffffff" />

        <Suspense fallback={null}>
          <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.2}>
            <Earth variant={variant} />
          </Float>

          {variant === "hero" && (
            <Stars
              radius={40}
              depth={50}
              count={500}
              factor={1.4}
              saturation={0}
              fade
              speed={0.25}
            />
          )}
        </Suspense>

        {variant === "hero" && interactive && <ScrollSpeedRig />}
      </Canvas>
    </div>
  );
}

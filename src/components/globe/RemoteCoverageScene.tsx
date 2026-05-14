"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SRGBColorSpace, TextureLoader, type Group } from "three";

/**
 * SpinningEarth — the night-Earth sphere wrapped in a group so we can
 * rotate it directly via useFrame (more reliable than OrbitControls'
 * `autoRotate`, which can get clobbered by Suspense remounts and damping).
 *
 *   • Texture: `/textures/earth-lights.png` — the standard NASA black-
 *     marble Earth-at-night image. Pure black ocean, bright city lights.
 *     Loaded from /public so it can never fail to fetch.
 *   • `texture.colorSpace = SRGBColorSpace` — REQUIRED on Three.js r155+
 *     otherwise the texture renders with the wrong gamma curve.
 *   • `toneMapped={false}` — prevents Three's tone mapping from washing
 *     bright pixels toward white.
 *   • Rotation pauses both when the wrapper's pause button is on AND
 *     while the user is actively dragging — gives the natural "spins on
 *     standby, pauses while you're interacting" feel.
 */
function SpinningEarth({
  paused,
  dragging,
}: {
  paused: boolean;
  dragging: boolean;
}) {
  const groupRef = useRef<Group>(null);
  // Solar System Scope's 2K Black Marble — pure black ocean, dark
  // continents, bright city lights. Standard NASA Earth-at-night.
  const texture = useLoader(TextureLoader, "/textures/earth-night-2k.jpg");
  texture.colorSpace = SRGBColorSpace;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (paused || dragging) return;
    groupRef.current.rotation.y += delta * 0.18; // slow + continuous
  });

  return (
    <group ref={groupRef}>
      <mesh>
        {/* Smaller sphere so it ALWAYS fits the frame regardless of the
            canvas's exact aspect ratio. Radius 1.6 → angular size 26°
            at camera z=7 → 50% margin against the 50° FOV below. */}
        <sphereGeometry args={[1.6, 128, 128]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * RemoteCoverageScene — Canvas + spinning Earth + drag controls.
 *
 *   • Auto-rotate is driven by useFrame inside SpinningEarth (not by
 *     OrbitControls), so it always works regardless of damping / Suspense.
 *   • OrbitControls is configured for drag-only: rotation enabled, no
 *     zoom, no pan, autoRotate off. While the user holds + drags, our
 *     own `dragging` state pauses the useFrame rotation; when they let
 *     go, rotation resumes immediately.
 */
export default function RemoteCoverageScene({
  paused,
}: {
  paused: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <Canvas
      // Camera + FOV chosen so the sphere (radius 1.6) NEVER clips,
      // even if the canvas ends up slightly non-square due to layout.
      //   Sphere angular size at z=7 ≈ 2·atan(1.6/7) ≈ 26°.
      //   FOV 50° gives 12° of margin on each side → globe sits well
      //   inside the frame as a complete circle.
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      frameloop="always"
    >
      <color attach="background" args={["#000000"]} />

      <Suspense fallback={null}>
        <SpinningEarth paused={paused} dragging={dragging} />
      </Suspense>

      <OrbitControls
        enableRotate
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.6}
        enableDamping
        dampingFactor={0.08}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
      />
    </Canvas>
  );
}

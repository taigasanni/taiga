"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useColor } from "@/lib/ColorContext";
import { hslToHex } from "@/lib/colorUtils";

// Generate bowl geometry vertices
function createBowlGeometry() {
  const points: THREE.Vector2[] = [];
  const segments = 30;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Bowl profile curve: wider at top, narrow at bottom
    const y = t * 2 - 0.5; // -0.5 to 1.5
    let x: number;

    if (t < 0.1) {
      // Bottom (flat)
      x = t * 8 * 0.3;
    } else if (t < 0.8) {
      // Bowl body (smooth curve)
      const bodyT = (t - 0.1) / 0.7;
      x = 0.24 + Math.pow(bodyT, 0.6) * 0.76;
    } else {
      // Rim (slight outward flare)
      const rimT = (t - 0.8) / 0.2;
      x = 1.0 + rimT * 0.05;
    }

    points.push(new THREE.Vector2(x, y));
  }

  return points;
}

export default function Bowl3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.LatheGeometry>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const deformTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const deformStrength = useRef(0);
  const isHovering = useRef(false);

  const { currentColor, combinedProgress } = useColor();

  const bowlPoints = useMemo(() => createBowlGeometry(), []);

  // Store original positions after geometry is created
  const geometryRefCallback = useCallback(
    (node: THREE.LatheGeometry | null) => {
      if (node && !originalPositions.current) {
        geometryRef.current = node;
        originalPositions.current = new Float32Array(
          node.attributes.position.array
        );
      }
    },
    []
  );

  // Mouse interaction
  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (meshRef.current) {
      deformTarget.current.copy(e.point);
      isHovering.current = true;
      deformStrength.current = Math.min(deformStrength.current + 0.02, 0.3);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    isHovering.current = false;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !geometryRef.current || !originalPositions.current)
      return;

    // Slow auto-rotation (15-20 seconds per revolution)
    meshRef.current.rotation.y += 0.004;

    // Slight floating motion
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

    // Deformation logic
    if (!isHovering.current) {
      // Spring back to original
      deformStrength.current *= 0.95;
    }

    if (deformStrength.current > 0.001) {
      const positions = geometryRef.current.attributes.position;
      const original = originalPositions.current;

      for (let i = 0; i < positions.count; i++) {
        const ox = original[i * 3];
        const oy = original[i * 3 + 1];
        const oz = original[i * 3 + 2];

        // Calculate world position of vertex
        const worldPos = new THREE.Vector3(ox, oy, oz);
        meshRef.current!.localToWorld(worldPos);

        // Distance from pointer
        const dist = worldPos.distanceTo(deformTarget.current);
        const influence =
          Math.max(0, 1 - dist / 1.5) * deformStrength.current;

        if (influence > 0) {
          // Pull vertex toward pointer
          const dir = deformTarget.current
            .clone()
            .sub(worldPos)
            .normalize();
          meshRef.current!.worldToLocal(dir);

          positions.setXYZ(
            i,
            ox + dir.x * influence * 0.3,
            oy + dir.y * influence * 0.15,
            oz + dir.z * influence * 0.3
          );
        } else {
          // Spring back
          const cx = positions.getX(i);
          const cy = positions.getY(i);
          const cz = positions.getZ(i);
          positions.setXYZ(
            i,
            cx + (ox - cx) * 0.08,
            cy + (oy - cy) * 0.08,
            cz + (oz - cz) * 0.08
          );
        }
      }

      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  });

  // Bowl color based on dye progress
  const bowlColor = useMemo(() => {
    const white = "#fafafa";
    const accent = hslToHex(currentColor);
    // Interpolate between white and accent based on combinedProgress
    const r1 = parseInt(white.slice(1, 3), 16);
    const g1 = parseInt(white.slice(3, 5), 16);
    const b1 = parseInt(white.slice(5, 7), 16);
    const r2 = parseInt(accent.slice(1, 3), 16);
    const g2 = parseInt(accent.slice(3, 5), 16);
    const b2 = parseInt(accent.slice(5, 7), 16);
    const t = combinedProgress * 0.6;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }, [currentColor, combinedProgress]);

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      scale={1.2}
      position={[0, 0.2, 0]}
    >
      <latheGeometry
        ref={geometryRefCallback}
        args={[bowlPoints, 64, 0, Math.PI * 2]}
      />
      <meshPhysicalMaterial
        color={bowlColor}
        roughness={0.8}
        metalness={0.0}
        clearcoat={0.1}
        clearcoatRoughness={0.9}
        transmission={0.02}
        thickness={0.5}
        envMapIntensity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

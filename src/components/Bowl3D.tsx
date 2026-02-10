"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useColor } from "@/lib/ColorContext";
import { hslToHex } from "@/lib/colorUtils";

// Generate bowl geometry — rounded bottom
function createBowlGeometry() {
  const points: THREE.Vector2[] = [];
  const segments = 40;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * 1.8 - 0.3;
    let x: number;

    if (t < 0.15) {
      const bottomT = t / 0.15;
      x = Math.sin(bottomT * Math.PI * 0.5) * 0.45;
    } else if (t < 0.75) {
      const bodyT = (t - 0.15) / 0.6;
      x = 0.45 + Math.pow(bodyT, 0.5) * 0.6;
    } else {
      const rimT = (t - 0.75) / 0.25;
      x = 1.05 + Math.sin(rimT * Math.PI * 0.5) * 0.03;
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
  const smoothScroll = useRef(0);

  const { currentColor, combinedProgress, scrollProgress } = useColor();

  const bowlPoints = useMemo(() => createBowlGeometry(), []);

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

    const time = state.clock.elapsedTime;

    // Smooth scroll interpolation for fluid motion
    smoothScroll.current += (scrollProgress - smoothScroll.current) * 0.05;
    const scroll = smoothScroll.current;

    // Auto-rotation — speeds up slightly with scroll
    meshRef.current.rotation.y += 0.003 + scroll * 0.004;

    // Floating + scroll-driven tilt & drift
    meshRef.current.position.y =
      0.1 + Math.sin(time * 0.4) * 0.04 - scroll * 0.3;
    meshRef.current.rotation.x = scroll * 0.15;
    meshRef.current.rotation.z = Math.sin(time * 0.3) * scroll * 0.08;

    // Scale shifts organically with scroll
    const base = 1.2;
    meshRef.current.scale.set(
      base + Math.sin(scroll * Math.PI) * 0.15,
      base - Math.sin(scroll * Math.PI * 0.7) * 0.1,
      base + Math.cos(scroll * Math.PI * 1.3) * 0.1
    );

    // === Vertex deformation ===
    if (!isHovering.current) {
      deformStrength.current *= 0.95;
    }

    const shouldDeform = deformStrength.current > 0.001 || scroll > 0.01;
    if (!shouldDeform) return;

    const positions = geometryRef.current.attributes.position;
    const original = originalPositions.current;

    for (let i = 0; i < positions.count; i++) {
      const ox = original[i * 3];
      const oy = original[i * 3 + 1];
      const oz = original[i * 3 + 2];

      let dx = 0,
        dy = 0,
        dz = 0;

      // --- Scroll-based organic deformation ---
      if (scroll > 0.01) {
        const heightRatio = (oy + 0.3) / 1.8; // 0=bottom, 1=rim
        const angle = Math.atan2(oz, ox);
        const radius = Math.sqrt(ox * ox + oz * oz);

        // Wave undulation — ripples along the surface
        const wave1 =
          Math.sin(heightRatio * Math.PI * 3 + time * 0.8 + angle * 2) *
          scroll * 0.08;
        const wave2 =
          Math.cos(heightRatio * Math.PI * 2 + time * 0.5 - angle * 3) *
          scroll * 0.05;

        // Breathing — expand/contract varying by height
        const breathe =
          Math.sin(time * 0.6 + heightRatio * Math.PI) * scroll * 0.06;

        // Twist — rotate vertices around Y based on height
        const twist = scroll * heightRatio * 0.3;
        const cosT = Math.cos(twist);
        const sinT = Math.sin(twist);
        const twistedX = ox * cosT - oz * sinT;
        const twistedZ = ox * sinT + oz * cosT;

        // Pinch/bulge at certain scroll ranges
        const bulge =
          Math.sin(scroll * Math.PI * 2) *
          Math.sin(heightRatio * Math.PI) * 0.12;

        const newRadius = radius + wave1 + wave2 + breathe + bulge;
        const radiusScale = radius > 0.001 ? newRadius / radius : 1;

        dx = twistedX * radiusScale - ox;
        dy = Math.sin(angle * 3 + time * 0.7) * scroll * 0.03;
        dz = twistedZ * radiusScale - oz;
      }

      // --- Mouse/touch deformation ---
      if (deformStrength.current > 0.001) {
        const worldPos = new THREE.Vector3(ox + dx, oy + dy, oz + dz);
        meshRef.current!.localToWorld(worldPos);

        const dist = worldPos.distanceTo(deformTarget.current);
        const influence =
          Math.max(0, 1 - dist / 1.5) * deformStrength.current;

        if (influence > 0) {
          const dir = deformTarget.current.clone().sub(worldPos).normalize();
          meshRef.current!.worldToLocal(dir);
          dx += dir.x * influence * 0.3;
          dy += dir.y * influence * 0.15;
          dz += dir.z * influence * 0.3;
        }
      }

      // Smooth spring interpolation
      const cx = positions.getX(i);
      const cy = positions.getY(i);
      const cz = positions.getZ(i);
      positions.setXYZ(
        i,
        cx + (ox + dx - cx) * 0.06,
        cy + (oy + dy - cy) * 0.06,
        cz + (oz + dz - cz) * 0.06
      );
    }

    positions.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  });

  // Bowl color
  const bowlColor = useMemo(() => {
    const white = "#fafafa";
    const accent = hslToHex(currentColor);
    const r1 = parseInt(white.slice(1, 3), 16);
    const g1 = parseInt(white.slice(3, 5), 16);
    const b1 = parseInt(white.slice(5, 7), 16);
    const r2 = parseInt(accent.slice(1, 3), 16);
    const g2 = parseInt(accent.slice(3, 5), 16);
    const b2 = parseInt(accent.slice(5, 7), 16);
    const t = combinedProgress * 0.35;
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
      position={[0.3, 0.1, 0]}
    >
      <latheGeometry
        ref={geometryRefCallback}
        args={[bowlPoints, 64, 0, Math.PI * 2]}
      />
      <meshPhysicalMaterial
        color={bowlColor}
        roughness={0.85}
        metalness={0.0}
        clearcoat={0.05}
        clearcoatRoughness={0.95}
        transmission={0.15}
        thickness={0.8}
        envMapIntensity={0.15}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

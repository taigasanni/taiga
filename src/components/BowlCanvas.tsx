"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Bowl3D from "./Bowl3D";

export default function BowlCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0.8, 1.2, 5.5], fov: 30 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} />
          <pointLight position={[0, -2, 0]} intensity={0.2} />
          <Environment preset="studio" environmentIntensity={0.2} />
          <Bowl3D />
        </Suspense>
      </Canvas>
    </div>
  );
}

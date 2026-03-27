"use client";

import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function DyeOverlay() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-all duration-[2000ms]"
      style={{
        background: `radial-gradient(ellipse at 50% 100%, ${hslToString(currentColor, combinedProgress * 0.12)} 0%, transparent 70%)`,
      }}
    />
  );
}

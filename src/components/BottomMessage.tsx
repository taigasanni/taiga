"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function BottomMessage() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <section className="relative py-40 md:py-56 px-6">
      {/* Stronger dye at the bottom */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.2)} 100%)`,
        }}
      />

      <div className="relative max-w-[900px] mx-auto text-center">
        <ScrollReveal>
          <p
            className="text-[#1a1a1a]/30 mb-10"
            style={{
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
              fontWeight: 200,
              letterSpacing: "0.1em",
            }}
          >
            あなたと共に色づきました
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Link
            href="/contact"
            className="inline-block text-sm tracking-[0.25em] text-[#1a1a1a]/50 no-underline border-b border-[#1a1a1a]/10 pb-2 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/25 transition-all duration-500 uppercase"
          >
            Get in Touch
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

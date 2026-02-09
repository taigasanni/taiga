"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function BottomMessage() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <section className="relative py-32 md:py-48 px-6">
      {/* Stronger dye at the bottom */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.2)} 100%)`,
        }}
      />

      <div className="relative max-w-[700px] mx-auto text-center">
        <ScrollReveal>
          <p
            className="text-[#1a1a1a]/40 text-lg mb-8"
            style={{ fontWeight: 300, letterSpacing: "0.08em" }}
          >
            あなたと共に色づきました
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Link
            href="/contact"
            className="inline-block text-sm tracking-[0.2em] text-[#1a1a1a]/60 no-underline border-b border-[#1a1a1a]/15 pb-1 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30 transition-all duration-300"
          >
            Contact Us
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

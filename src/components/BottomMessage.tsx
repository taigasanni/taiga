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

      <div className="relative max-w-[700px] mx-auto text-center">
        <ScrollReveal>
          <p
            className="text-[#1a1a1a]/50 mb-6"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              fontWeight: 300,
              lineHeight: 2,
            }}
          >
            売ることは、誇っていい。
            <br />
            いい商品なら、なおさらです。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p
            className="text-[#1a1a1a] mb-16"
            style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
              fontWeight: 300,
              lineHeight: 1.4,
            }}
          >
            いい商品を、ちゃんと売る。
            <br />
            <span className="text-[#1a1a1a]/60" style={{ fontSize: "0.7em" }}>
              それが、株式会社白器のマーケティングです。
            </span>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <Link
            href="/contact"
            className="inline-block text-sm tracking-[0.25em] text-[#1a1a1a]/60 no-underline border-b border-[#1a1a1a]/15 pb-2 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30 transition-all duration-500 uppercase"
          >
            お問い合わせ
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

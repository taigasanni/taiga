"use client";

import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

const services = [
  {
    title: "Design",
    description:
      "ブランドの本質を視覚化し、直感的に伝わるデザインを設計します。ロゴ、ウェブサイト、グラフィックまで。",
  },
  {
    title: "Marketing",
    description:
      "戦略的なマーケティングで、ブランドのメッセージを適切な人に届けます。デジタル施策からコンテンツ戦略まで。",
  },
  {
    title: "Branding",
    description:
      "企業の核となるアイデンティティを一緒に見つけ、一貫した世界観を構築します。",
  },
];

export default function WhatWeDoSection() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <section className="relative py-32 md:py-48 px-6">
      {/* Subtle dye gradient */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.06)} 50%, transparent 100%)`,
        }}
      />

      <div className="relative max-w-[700px] mx-auto">
        <ScrollReveal>
          <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-4 uppercase">
            What We Do
          </p>
          <h2 className="text-[#1a1a1a] mb-20">
            クライアントの色に
            <br />
            染まりながら、共に描く。
          </h2>
        </ScrollReveal>

        <div className="space-y-20">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.1}>
              <div className="group">
                <div className="flex items-baseline gap-6 mb-4">
                  <span className="text-sm text-[#1a1a1a]/20 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[#1a1a1a]">{service.title}</h3>
                </div>
                <p className="text-[#1a1a1a]/50 ml-12 max-w-lg">
                  {service.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

const services = [
  {
    number: "01",
    title: "Design",
    subtitle: "デザイン",
    description:
      "ブランドの本質を視覚化し、直感的に伝わるデザインを設計します。ウェブサイト、ロゴ、グラフィック、UI/UXまで一貫して。",
    imagePlaceholder: "ブランドデザイン事例",
  },
  {
    number: "02",
    title: "Marketing",
    subtitle: "マーケティング",
    description:
      "戦略的なマーケティングで、ブランドのメッセージを適切な人に届けます。デジタル施策、SNS運用、コンテンツ戦略。",
    imagePlaceholder: "マーケティング施策事例",
  },
  {
    number: "03",
    title: "Branding",
    subtitle: "ブランディング",
    description:
      "企業の核となるアイデンティティを一緒に見つけ、一貫した世界観を構築します。",
    imagePlaceholder: "ブランディング事例",
  },
];

export default function WhatWeDoSection() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <section className="relative py-32 md:py-48">
      {/* Subtle dye gradient */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.06)} 50%, transparent 100%)`,
        }}
      />

      <div className="relative">
        {/* Section header — full width bold */}
        <div className="px-6 md:px-16 lg:px-24 mb-24">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/30 mb-4 uppercase">
              What We Do
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              className="text-[#1a1a1a]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 200 }}
            >
              クライアントの色に
              <br />
              染まりながら、共に描く。
            </h2>
          </ScrollReveal>
        </div>

        {/* Services — alternating layout with image placeholders */}
        <div className="space-y-32 md:space-y-48">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={0.1}>
              <div
                className={`flex flex-col gap-8 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Image placeholder */}
                <div className="md:w-1/2 px-6 md:px-0">
                  <div
                    className={`${
                      i % 2 === 0 ? "md:ml-16 lg:ml-24" : "md:mr-16 lg:mr-24"
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-[#1a1a1a]/[0.03] overflow-hidden">
                      {/* Placeholder — replace with actual images */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-[#1a1a1a]/15 text-sm tracking-wider">
                          {service.imagePlaceholder}
                        </p>
                      </div>
                      {/* Subtle accent border */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-[2000ms]"
                        style={{
                          background: hslToString(
                            currentColor,
                            combinedProgress * 0.3
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="md:w-1/2 flex items-center">
                  <div
                    className={`px-6 ${
                      i % 2 === 0
                        ? "md:pl-16 lg:pl-24 md:pr-16"
                        : "md:pr-16 lg:pr-24 md:pl-16"
                    }`}
                  >
                    <span className="text-xs text-[#1a1a1a]/15 tracking-[0.3em]">
                      {service.number}
                    </span>
                    <h3
                      className="text-[#1a1a1a] mt-3 mb-1"
                      style={{
                        fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                        fontWeight: 300,
                      }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-[#1a1a1a]/30 text-sm mb-6">
                      {service.subtitle}
                    </p>
                    <p className="text-[#1a1a1a]/50 leading-[2] max-w-md">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

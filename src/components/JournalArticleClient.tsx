"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";
import type { JournalEntry } from "@/data/journal";

interface Props {
  entry: JournalEntry;
}

export default function JournalArticleClient({ entry }: Props) {
  const { combinedProgress, setArticleColor } = useColor();

  useEffect(() => {
    setArticleColor(entry.themeColor);
  }, [entry.themeColor, setArticleColor]);

  const paragraphs = entry.content.split("\n\n").filter(Boolean);

  return (
    <div>
      {/* Article dye overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${hslToString(entry.themeColor, combinedProgress * 0.08)} 0%, transparent 60%)`,
        }}
      />

      {/* Back link */}
      <section className="pt-32 pb-4 px-6 md:px-16 lg:px-24">
        <div className="max-w-[800px]">
          <Link
            href="/journal"
            className="text-sm text-[#1a1a1a]/50 no-underline hover:text-[#1a1a1a]/80 transition-colors duration-300"
          >
            ← Journal
          </Link>
        </div>
      </section>

      {/* Article header */}
      <section className="pt-12 pb-8 px-6 md:px-16 lg:px-24">
        <div className="max-w-[800px]">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs text-[#1a1a1a]/45 tracking-wider font-medium">
                {entry.category}
              </span>
              <span className="text-xs text-[#1a1a1a]/30">{entry.date}</span>
            </div>
            <h1
              className="text-[#1a1a1a]"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 300 }}
            >
              {entry.title}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Eyecatch image */}
      <section className="py-10 px-6 md:px-16 lg:px-24">
        <div className="max-w-[900px]">
          <ScrollReveal>
            <div className="relative aspect-[2/1] bg-[#1a1a1a]/[0.05] overflow-hidden">
              {entry.eyecatch ? (
                <Image
                  src={entry.eyecatch}
                  alt={entry.eyecatchAlt || entry.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#1a1a1a]/20 text-sm tracking-wider">
                    アイキャッチ画像
                  </p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Article body */}
      <section className="pb-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[700px]">
          {paragraphs.map((paragraph, i) => {
            // Check for HTML heading tags
            const h2Match = paragraph.match(/^<h2>(.*?)<\/h2>$/);
            const h3Match = paragraph.match(/^<h3>(.*?)<\/h3>$/);
            const h4Match = paragraph.match(/^<h4>(.*?)<\/h4>$/);

            if (h2Match) {
              return (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <h2
                    className="text-[#1a1a1a] mt-16 mb-6"
                    style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 300, lineHeight: 1.6 }}
                  >
                    {h2Match[1]}
                  </h2>
                </ScrollReveal>
              );
            }

            if (h3Match) {
              return (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <h3
                    className="text-[#1a1a1a]/90 mt-12 mb-4"
                    style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 400, lineHeight: 1.6 }}
                  >
                    {h3Match[1]}
                  </h3>
                </ScrollReveal>
              );
            }

            if (h4Match) {
              return (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <h4
                    className="text-[#1a1a1a]/85 mt-8 mb-3"
                    style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 500, lineHeight: 1.6 }}
                  >
                    {h4Match[1]}
                  </h4>
                </ScrollReveal>
              );
            }

            return (
              <ScrollReveal key={i} delay={i * 0.05}>
                <p className="text-[#1a1a1a]/75 leading-[2.2] mb-8">
                  {paragraph}
                </p>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Back to journal */}
      <section className="pb-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[700px]">
          <ScrollReveal>
            <Link
              href="/journal"
              className="text-sm text-[#1a1a1a]/50 tracking-wider no-underline hover:text-[#1a1a1a]/80 transition-colors duration-300"
            >
              ← すべての記事へ
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

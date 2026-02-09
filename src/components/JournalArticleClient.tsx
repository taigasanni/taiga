"use client";

import { useEffect } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";
import type { JournalEntry } from "@/data/journal";

interface Props {
  entry: JournalEntry;
}

export default function JournalArticleClient({ entry }: Props) {
  const { currentColor, combinedProgress, setArticleColor } = useColor();

  // Set article theme color
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
          background: `radial-gradient(ellipse at 50% 30%, ${hslToString(entry.themeColor, combinedProgress * 0.1)} 0%, transparent 60%)`,
        }}
      />

      {/* Back link */}
      <section className="pt-32 pb-4 px-6">
        <div className="max-w-[700px] mx-auto">
          <Link
            href="/journal"
            className="text-sm text-[#1a1a1a]/30 no-underline hover:text-[#1a1a1a]/60 transition-colors duration-300"
          >
            ← Journal
          </Link>
        </div>
      </section>

      {/* Article header */}
      <section className="pt-12 pb-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs text-[#1a1a1a]/30 tracking-wider">
                {entry.category}
              </span>
              <span className="text-xs text-[#1a1a1a]/20">{entry.date}</span>
            </div>
            <h1 className="text-[#1a1a1a] mb-4">{entry.title}</h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Article body */}
      <section className="pb-32 px-6">
        <div className="max-w-[700px] mx-auto">
          {paragraphs.map((paragraph, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <p className="text-[#1a1a1a]/60 leading-[2.2] mb-8">
                {paragraph}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Back to journal */}
      <section className="pb-32 px-6">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <Link
              href="/journal"
              className="text-sm text-[#1a1a1a]/40 tracking-wider no-underline hover:text-[#1a1a1a]/60 transition-colors duration-300"
            >
              ← すべての記事へ
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

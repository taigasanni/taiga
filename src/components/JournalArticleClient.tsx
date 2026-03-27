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

/** Check if content is HTML (from Tiptap editor) vs legacy \n\n format */
function isHtmlContent(content: string): boolean {
  return content.includes("<p>") || content.includes("<h2>") || content.includes("<h3>");
}

/** Render inline formatting (<strong>) within text — used only for legacy content */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let rem = text;
  let k = 0;
  while (rem.length > 0) {
    const m = rem.match(/<strong>(.*?)<\/strong>/);
    if (m && m.index !== undefined) {
      if (m.index > 0) parts.push(rem.slice(0, m.index));
      parts.push(
        <strong key={k++} className="text-white font-semibold">
          {m[1]}
        </strong>
      );
      rem = rem.slice(m.index + m[0].length);
    } else {
      parts.push(rem);
      break;
    }
  }
  return parts;
}

export default function JournalArticleClient({ entry }: Props) {
  const { combinedProgress, setArticleColor } = useColor();

  useEffect(() => {
    setArticleColor(entry.themeColor);
  }, [entry.themeColor, setArticleColor]);

  const htmlMode = isHtmlContent(entry.content);

  /* ── Legacy block renderer (old \n\n format) ── */
  const renderLegacyBlocks = () => {
    const blocks = entry.content.split("\n\n").filter(Boolean);

    const renderBlock = (block: string, i: number) => {
      const b = block.trim();

      const h2 = b.match(/^<h2>([\s\S]*?)<\/h2>$/);
      if (h2) {
        return (
          <ScrollReveal key={i} delay={i * 0.05}>
            <h2
              className="text-white mt-16 mb-6"
              style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 300, lineHeight: 1.6 }}
            >
              {h2[1]}
            </h2>
          </ScrollReveal>
        );
      }

      const h3 = b.match(/^<h3>([\s\S]*?)<\/h3>$/);
      if (h3) {
        return (
          <ScrollReveal key={i} delay={i * 0.05}>
            <h3
              className="text-white/85 mt-12 mb-4"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 400, lineHeight: 1.6 }}
            >
              {h3[1]}
            </h3>
          </ScrollReveal>
        );
      }

      const h4 = b.match(/^<h4>([\s\S]*?)<\/h4>$/);
      if (h4) {
        return (
          <ScrollReveal key={i} delay={i * 0.05}>
            <h4
              className="text-white/80 mt-8 mb-3"
              style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 500, lineHeight: 1.6 }}
            >
              {h4[1]}
            </h4>
          </ScrollReveal>
        );
      }

      const img = b.match(/^<img\s+src="([^"]*)"(?:\s+alt="([^"]*)")?\s*\/?>$/);
      if (img) {
        return (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="my-10 relative aspect-[16/9] bg-white/[0.05] rounded-md overflow-hidden">
              <Image src={img[1]} alt={img[2] || ""} fill className="object-cover" />
            </div>
          </ScrollReveal>
        );
      }

      if (b.startsWith("<ul>") || b.startsWith("<ul ")) {
        const items = [...b.matchAll(/<li>(.*?)<\/li>/g)].map((m) => m[1]);
        return (
          <ScrollReveal key={i} delay={i * 0.05}>
            <ul className="list-disc list-inside space-y-2 my-6 text-white/65 leading-[2]">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          </ScrollReveal>
        );
      }

      if (b.startsWith("<table>") || b.startsWith("<table ")) {
        const rows = [...b.matchAll(/<tr>(.*?)<\/tr>/g)].map((m) => m[1]);
        return (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="my-8 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {rows.map((row, ri) => {
                    const isHeader = row.includes("<th>");
                    const cells = isHeader
                      ? [...row.matchAll(/<th>(.*?)<\/th>/g)].map((m) => m[1])
                      : [...row.matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);
                    return (
                      <tr
                        key={ri}
                        className={
                          isHeader
                            ? "border-b border-white/15"
                            : "border-b border-white/5"
                        }
                      >
                        {cells.map((c, ci) =>
                          isHeader ? (
                            <th
                              key={ci}
                              className="text-left py-3 px-4 font-medium text-white/80"
                            >
                              {renderInline(c)}
                            </th>
                          ) : (
                            <td key={ci} className="py-3 px-4 text-white/60">
                              {renderInline(c)}
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        );
      }

      return (
        <ScrollReveal key={i} delay={i * 0.05}>
          <p className="text-white/65 leading-[2.2] mb-8">
            {renderInline(b)}
          </p>
        </ScrollReveal>
      );
    };

    return blocks.map((block, i) => renderBlock(block, i));
  };

  return (
    <div className="dark-page">
      {/* Article dye overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${hslToString(entry.themeColor, combinedProgress * 0.06)} 0%, transparent 60%)`,
        }}
      />

      {/* Back link */}
      <section className="pt-32 pb-4 px-6 md:px-16 lg:px-24">
        <div className="max-w-[800px] mx-auto">
          <Link
            href="/journal"
            className="text-sm text-white/50 no-underline hover:text-white/80 transition-colors duration-300"
          >
            ← Journal
          </Link>
        </div>
      </section>

      {/* Article header */}
      <section className="pt-12 pb-8 px-6 md:px-16 lg:px-24">
        <div className="max-w-[800px] mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs text-white/45 tracking-wider font-medium">
                {entry.category}
              </span>
              <span className="text-xs text-white/30">{entry.date}</span>
            </div>
            <h1
              className="text-white"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 300 }}
            >
              {entry.title}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Eyecatch image */}
      {entry.eyecatch && (
        <section className="py-10 px-6 md:px-16 lg:px-24">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <div className="relative aspect-[2/1] bg-white/[0.05] overflow-hidden">
                <Image
                  src={entry.eyecatch}
                  alt={entry.eyecatchAlt || entry.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Article body */}
      <section className="pb-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[700px] mx-auto">
          {htmlMode ? (
            /* New HTML content from Tiptap — render with CSS styles */
            <ScrollReveal>
              <div
                className="article-html"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </ScrollReveal>
          ) : (
            /* Legacy \n\n content — parse blocks individually */
            renderLegacyBlocks()
          )}
        </div>
      </section>

      {/* Back to journal */}
      <section className="pb-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <Link
              href="/journal"
              className="text-sm text-white/50 tracking-wider no-underline hover:text-white/80 transition-colors duration-300"
            >
              ← すべての記事へ
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

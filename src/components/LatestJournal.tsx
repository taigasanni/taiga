"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { journalEntries } from "@/data/journal";

export default function LatestJournal() {
  const latest = journalEntries.slice(0, 3);

  return (
    <section className="py-32 md:py-48 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-4 uppercase font-medium">
            Journal
          </p>
          <h2
            className="text-[#1a1a1a] mb-20"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}
          >
            思考の記録
          </h2>
        </ScrollReveal>

        {/* Card grid with eyecatch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {latest.map((entry, i) => (
            <ScrollReveal key={entry.slug} delay={i * 0.1}>
              <Link
                href={`/journal/${entry.slug}`}
                className="group block no-underline"
              >
                {/* Eyecatch */}
                <div className="relative aspect-[16/10] bg-[#1a1a1a]/[0.05] overflow-hidden mb-5">
                  {entry.eyecatch ? (
                    <Image
                      src={entry.eyecatch}
                      alt={entry.eyecatchAlt || entry.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center group-hover:bg-[#1a1a1a]/[0.08] transition-colors duration-500">
                      <p className="text-[#1a1a1a]/20 text-xs tracking-wider">
                        Eyecatch
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-[#1a1a1a]/40 tracking-wider font-medium">
                    {entry.category}
                  </span>
                  <span className="text-xs text-[#1a1a1a]/30">
                    {entry.date}
                  </span>
                </div>
                <h3
                  className="text-[#1a1a1a] group-hover:opacity-60 transition-opacity duration-300"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", fontWeight: 400 }}
                >
                  {entry.title}
                </h3>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-16">
            <Link
              href="/journal"
              className="text-sm text-[#1a1a1a]/50 tracking-wider no-underline hover:text-[#1a1a1a]/80 transition-colors duration-300"
            >
              すべての記事を見る →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

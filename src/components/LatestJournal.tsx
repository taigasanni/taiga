"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { journalEntries } from "@/data/journal";

export default function LatestJournal() {
  const latest = journalEntries.slice(0, 3);

  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-[700px] mx-auto">
        <ScrollReveal>
          <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-4 uppercase">
            Journal
          </p>
          <h2 className="text-[#1a1a1a] mb-20">思考の記録</h2>
        </ScrollReveal>

        <div className="space-y-0">
          {latest.map((entry, i) => (
            <ScrollReveal key={entry.slug} delay={i * 0.1}>
              <Link
                href={`/journal/${entry.slug}`}
                className="group block py-8 border-b border-[#1a1a1a]/5 no-underline"
              >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                  <h3 className="text-[#1a1a1a] group-hover:opacity-60 transition-opacity duration-300">
                    {entry.title}
                  </h3>
                  <span className="text-sm text-[#1a1a1a]/30 shrink-0">
                    {entry.date}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-12">
            <Link
              href="/journal"
              className="text-sm text-[#1a1a1a]/40 tracking-wider no-underline hover:text-[#1a1a1a]/60 transition-colors duration-300"
            >
              すべての記事を見る →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

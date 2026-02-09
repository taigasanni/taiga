"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { journalEntries } from "@/data/journal";

export default function JournalClient() {
  return (
    <div>
      <section className="min-h-[50vh] flex items-end pb-20 px-6">
        <div className="max-w-[700px] mx-auto w-full">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-4 uppercase">
              Journal
            </p>
            <h1 className="text-[#1a1a1a]">思考の記録</h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-[700px] mx-auto">
          {/* Category filter */}
          <ScrollReveal>
            <div className="flex gap-6 mb-16 pb-4 border-b border-[#1a1a1a]/5">
              <span className="text-sm text-[#1a1a1a]/70 cursor-pointer">
                All
              </span>
              <span className="text-sm text-[#1a1a1a]/30 cursor-pointer hover:text-[#1a1a1a]/60 transition-colors">
                Design
              </span>
              <span className="text-sm text-[#1a1a1a]/30 cursor-pointer hover:text-[#1a1a1a]/60 transition-colors">
                Marketing
              </span>
            </div>
          </ScrollReveal>

          {/* Articles list */}
          <div className="space-y-0">
            {journalEntries.map((entry, i) => (
              <ScrollReveal key={entry.slug} delay={i * 0.08}>
                <Link
                  href={`/journal/${entry.slug}`}
                  className="group block py-10 border-b border-[#1a1a1a]/5 no-underline"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#1a1a1a]/30 tracking-wider">
                        {entry.category}
                      </span>
                      <span className="text-xs text-[#1a1a1a]/20">
                        {entry.date}
                      </span>
                    </div>
                    <h2 className="text-[#1a1a1a] group-hover:opacity-60 transition-opacity duration-300 text-xl md:text-2xl">
                      {entry.title}
                    </h2>
                    <p className="text-[#1a1a1a]/40 text-sm max-w-lg">
                      {entry.excerpt}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

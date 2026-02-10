"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { journalEntries } from "@/data/journal";

export default function JournalClient() {
  return (
    <div>
      <section className="min-h-[50vh] flex items-end pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-[900px] mx-auto w-full">
          <ScrollReveal>
            <p className="text-sm tracking-[0.3em] text-[#1a1a1a]/50 mb-6 uppercase font-medium">
              Journal
            </p>
            <h1
              className="text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300 }}
            >
              思考の記録
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1100px] mx-auto">
          {/* Category filter */}
          <ScrollReveal>
            <div className="flex gap-6 mb-16 pb-4 border-b border-[#1a1a1a]/10">
              <span className="text-sm text-[#1a1a1a]/80 cursor-pointer font-medium">
                All
              </span>
              <span className="text-sm text-[#1a1a1a]/40 cursor-pointer hover:text-[#1a1a1a]/70 transition-colors">
                Design
              </span>
              <span className="text-sm text-[#1a1a1a]/40 cursor-pointer hover:text-[#1a1a1a]/70 transition-colors">
                Marketing
              </span>
            </div>
          </ScrollReveal>

          {/* Articles grid with eyecatch */}
          <div className="space-y-20">
            {journalEntries.map((entry, i) => (
              <ScrollReveal key={entry.slug} delay={i * 0.08}>
                <Link
                  href={`/journal/${entry.slug}`}
                  className="group block no-underline"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Eyecatch image */}
                    <div className="md:w-2/5 shrink-0">
                      <div className="relative aspect-[16/10] bg-[#1a1a1a]/[0.05] overflow-hidden">
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
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs text-[#1a1a1a]/45 tracking-wider font-medium">
                          {entry.category}
                        </span>
                        <span className="text-xs text-[#1a1a1a]/30">
                          {entry.date}
                        </span>
                      </div>
                      <h2
                        className="text-[#1a1a1a] group-hover:opacity-60 transition-opacity duration-300 mb-3"
                        style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 400 }}
                      >
                        {entry.title}
                      </h2>
                      <p className="text-[#1a1a1a]/55 text-sm leading-relaxed max-w-md">
                        {entry.excerpt}
                      </p>
                    </div>
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

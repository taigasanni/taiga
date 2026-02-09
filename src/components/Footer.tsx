"use client";

import Link from "next/link";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function Footer() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <footer className="relative py-20 px-6 md:px-12 border-t border-[#1a1a1a]/5">
      {/* Dye overlay at bottom */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `linear-gradient(to top, ${hslToString(currentColor, combinedProgress * 0.15)}, transparent)`,
        }}
      />

      <div className="relative max-w-[700px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div>
            <p
              className="text-lg tracking-widest mb-4"
              style={{ fontWeight: 300 }}
            >
              Hakki
            </p>
            <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">
              白い器のように、
              <br />
              あなたの色に染まる。
            </p>
          </div>

          <nav className="flex gap-10">
            <div className="flex flex-col gap-3">
              <Link
                href="/about"
                className="text-sm text-[#1a1a1a]/60 no-underline"
              >
                About
              </Link>
              <Link
                href="/journal"
                className="text-sm text-[#1a1a1a]/60 no-underline"
              >
                Journal
              </Link>
              <Link
                href="/contact"
                className="text-sm text-[#1a1a1a]/60 no-underline"
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-16 pt-6 border-t border-[#1a1a1a]/5">
          <p className="text-xs text-[#1a1a1a]/30">
            &copy; {new Date().getFullYear()} Hakki Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

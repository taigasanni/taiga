"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, -60]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero text — bold, large, centered over the bowl */}
      <motion.div
        className="relative z-10 text-center px-6 w-full max-w-[1000px] mx-auto"
        style={{ y: textY, opacity: textOpacity }}
      >
        <ScrollReveal>
          <p className="text-sm tracking-[0.3em] text-[#1a1a1a]/30 mb-8 uppercase">
            Design & Marketing Studio
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h1 className="text-[#1a1a1a] leading-[1.1]" style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", fontWeight: 200 }}>
            白い器
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p
            className="text-[#1a1a1a]/40 mt-6 text-xl md:text-2xl"
            style={{ fontWeight: 200, letterSpacing: "0.15em" }}
          >
            染まる、染める
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <p className="mt-20 text-[#1a1a1a]/25 text-xs tracking-[0.3em] uppercase">
            Scroll to explore
          </p>
          <motion.div
            className="mt-4 mx-auto w-[1px] h-12 bg-[#1a1a1a]/10"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </ScrollReveal>
      </motion.div>
    </section>
  );
}

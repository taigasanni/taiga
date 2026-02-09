"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const BowlCanvas = dynamic(() => import("./BowlCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-[#1a1a1a]/5" />
    </div>
  ),
});

export default function HeroSection() {
  const { scrollY } = useScroll();
  const bowlOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const bowlScale = useTransform(scrollY, [0, 600], [1, 0.9]);
  const textY = useTransform(scrollY, [0, 400], [0, -40]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Bowl */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity: bowlOpacity, scale: bowlScale }}
      >
        <div className="canvas-container interactive">
          <BowlCanvas />
        </div>
      </motion.div>

      {/* Hero text */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-[700px] mx-auto pointer-events-none"
        style={{ y: textY }}
      >
        <ScrollReveal>
          <h1 className="mb-6">
            <span className="block text-[#1a1a1a]">白い器</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-[#1a1a1a]/50 text-lg md:text-xl" style={{ fontWeight: 300, letterSpacing: "0.1em" }}>
            染まる、染める
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="mt-12 text-[#1a1a1a]/40 text-sm tracking-wider">
            Scroll
          </p>
          <motion.div
            className="mt-3 mx-auto w-[1px] h-8 bg-[#1a1a1a]/15"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </ScrollReveal>
      </motion.div>
    </section>
  );
}

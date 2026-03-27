"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, -60]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="relative z-10 text-center px-6 w-full max-w-[1000px] mx-auto"
        style={{ y: textY, opacity: textOpacity }}
      >
        <ScrollReveal>
          <p className="text-sm tracking-[0.3em] text-[#1a1a1a]/50 mb-10 uppercase font-medium">
            Marketing Company
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h1 className="text-[#1a1a1a] leading-[1.15]" style={{ fontSize: "clamp(2.2rem, 7vw, 5rem)", fontWeight: 300 }}>
            いい商品を、
            <br />
            ちゃんと売る。
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p
            className="text-[#1a1a1a]/50 mt-8 text-lg md:text-xl leading-relaxed max-w-[500px] mx-auto"
            style={{ fontWeight: 300 }}
          >
            売れない理由は、品質じゃない。
            <br />
            伝え方と、届け方。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <p className="mt-20 text-[#1a1a1a]/40 text-xs tracking-[0.3em] uppercase">
            Scroll to explore
          </p>
          <motion.div
            className="mt-4 mx-auto w-[1px] h-12 bg-[#1a1a1a]/20"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </ScrollReveal>
      </motion.div>
    </section>
  );
}

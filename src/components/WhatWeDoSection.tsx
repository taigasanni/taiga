"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function WhatWeDoSection() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <div>
      {/* Lead message */}
      <section className="py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <div className="max-w-[700px]">
          <ScrollReveal>
            <p className="text-[#1a1a1a]/80 leading-[2.2] text-lg md:text-xl" style={{ fontWeight: 300 }}>
              世の中には、
              <br />
              本当はもっと評価されるべき商品やサービスがたくさんあります。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-[#1a1a1a]/65 leading-[2.2] mt-10">
              売れない理由は、
              <br />
              品質が悪いからでも、努力が足りないからでもありません。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-[#1a1a1a]/80 leading-[2.2] mt-10 text-lg" style={{ fontWeight: 400 }}>
              伝え方と、届け方がズレているだけ。
              <br />
              私たちは、そこを整えるマーケティング会社です。
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Image break — with reveal animation */}
      <section className="px-6 md:px-16 lg:px-24">
        <motion.div
          className="relative aspect-[21/9] max-w-[1200px] overflow-hidden"
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
          whileHover={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-[-5%]"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src="/image.jpg"
              alt="白器のマーケティング"
              fill
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* 私たちの考え方 */}
      <section className="relative py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.05)} 50%, transparent 100%)`,
          }}
        />
        <div className="relative max-w-[700px]">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-6 uppercase font-medium">
              Our Approach
            </p>
            <h2
              className="text-[#1a1a1a] mb-16"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300 }}
            >
              私たちの考え方
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-[#1a1a1a]/70 leading-[2.2] mb-12">
              マーケティングは、
              <br />
              無理に売り込むことではありません。
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-[#1a1a1a]/60 leading-[2] mb-10">
              大切なのは、
            </p>
            <ul className="space-y-6 mb-12">
              {[
                "何が価値なのかを整理すること",
                "誰に届けるべきかを決めること",
                "正しい順番で伝えること",
              ].map((item, i) => (
                <ScrollReveal key={i} delay={0.2 + i * 0.08}>
                  <li className="flex items-start gap-4">
                    <span className="w-1 h-1 rounded-full bg-[#1a1a1a]/30 mt-3 shrink-0" />
                    <span className="text-[#1a1a1a]/75 text-lg leading-relaxed" style={{ fontWeight: 400 }}>
                      {item}
                    </span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-[#1a1a1a]/80 leading-[2] text-lg" style={{ fontWeight: 400 }}>
              これができていれば、
              <br />
              いい商品は、ちゃんと売れます。
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* やらないこと & やること — 2 columns */}
      <section className="py-20 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1100px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-16">
            {/* やらないこと */}
            <div>
              <ScrollReveal>
                <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-6 uppercase font-medium">
                  What We Don&apos;t Do
                </p>
                <h3
                  className="text-[#1a1a1a] mb-10"
                  style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
                >
                  やらないこと
                </h3>
              </ScrollReveal>

              <div className="space-y-6">
                {[
                  "必要のない広告を大量に出す",
                  "流行りだけを真似した施策を勧める",
                  "中身より数字だけを見る",
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.08}>
                    <div className="flex items-start gap-4 py-4 border-b border-[#1a1a1a]/5">
                      <span className="text-[#1a1a1a]/20 text-sm mt-0.5">×</span>
                      <p className="text-[#1a1a1a]/65 leading-relaxed">{item}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={0.3}>
                <p className="text-[#1a1a1a]/50 leading-[2] mt-10 text-sm">
                  商品やサービスの「中身」を無視したマーケティングは、
                  長く続かないからです。
                </p>
              </ScrollReveal>
            </div>

            {/* やること */}
            <div>
              <ScrollReveal>
                <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-6 uppercase font-medium">
                  What We Do
                </p>
                <h3
                  className="text-[#1a1a1a] mb-10"
                  style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
                >
                  やること
                </h3>
              </ScrollReveal>

              <div className="space-y-6">
                {[
                  { num: "01", text: "商品・サービスの本質を理解する" },
                  { num: "02", text: "強みと言葉を整理する" },
                  { num: "03", text: "届く場所に、正しい形で出す" },
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.08}>
                    <div className="flex items-start gap-4 py-4 border-b border-[#1a1a1a]/8">
                      <span className="text-[#1a1a1a]/25 text-xs tracking-wider mt-1 font-medium">
                        {item.num}
                      </span>
                      <p className="text-[#1a1a1a]/80 leading-relaxed" style={{ fontWeight: 400 }}>
                        {item.text}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={0.3}>
                <p className="text-[#1a1a1a]/70 leading-[2] mt-10">
                  派手なことはしません。
                  <br />
                  でも、売れるべきものは、きちんと売れる状態をつくります。
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* こんな方に向いています */}
      <section className="relative py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.06)} 50%, transparent 100%)`,
          }}
        />
        <div className="relative max-w-[700px]">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-6 uppercase font-medium">
              For You
            </p>
            <h2
              className="text-[#1a1a1a] mb-16"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 300 }}
            >
              こんな方に向いています
            </h2>
          </ScrollReveal>

          <div className="space-y-8">
            {[
              "商品には自信があるのに、売れない",
              "広告を出しても成果が安定しない",
              "何から手をつければいいかわからない",
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex items-start gap-5 py-3">
                  <span className="w-2 h-[1px] bg-[#1a1a1a]/30 mt-3 shrink-0" />
                  <p className="text-[#1a1a1a]/75 text-lg leading-relaxed" style={{ fontWeight: 400 }}>
                    {item}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <p className="text-[#1a1a1a]/65 leading-[2] mt-14">
              一つでも当てはまるなら、
              <br />
              一度、話を聞かせてください。
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

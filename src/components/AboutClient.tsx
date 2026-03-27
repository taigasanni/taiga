"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function AboutClient() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <div className="dark-page">
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <p className="text-sm tracking-[0.3em] text-white/50 mb-8 uppercase font-medium">
              About
            </p>
            <h1
              className="text-white"
              style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: 300, lineHeight: 1.15 }}
            >
              いい商品を、
              <br />
              ちゃんと売る会社。
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy — with image */}
      <section className="py-20 md:py-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-0">
          <div className="md:w-1/2 px-6 md:px-0 md:pl-16 lg:pl-24">
            <ScrollReveal>
              <motion.div
                className="relative aspect-[3/4] overflow-hidden"
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute inset-[-10%]"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <Image
                    src="/image.jpg"
                    alt="白器チーム"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </ScrollReveal>
          </div>

          <div className="md:w-1/2 flex items-center px-6 md:pl-16 lg:pl-24 md:pr-16 lg:pr-24">
            <div>
              <ScrollReveal>
                <p className="text-white/80 leading-[2] text-lg" style={{ fontWeight: 400 }}>
                  白器（はっき）は「白い器」を意味します。
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-white/60 leading-[2] mt-8">
                  私たちは白い器のように、クライアントの商品やサービスの本質を受け止め、
                  その価値を正しく届けるマーケティング会社です。
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className="text-white/60 leading-[2] mt-6">
                  無理に売り込むのではなく、
                  伝え方と届け方を整える。
                  それだけで、いい商品はちゃんと売れると信じています。
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* What we value */}
      <section className="py-20 md:py-40 relative">
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.06)} 50%, transparent 100%)`,
          }}
        />
        <div className="relative px-6 md:px-16 lg:px-24">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-white/50 mb-20 uppercase font-medium">
              Our Values
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {[
              {
                num: "01",
                title: "本質を見る",
                desc: "商品やサービスの核にある価値を見つけ出し、言語化します。表面的な訴求ではなく、本当の強みで勝負する。",
              },
              {
                num: "02",
                title: "正しく届ける",
                desc: "誰に、どこで、どう伝えるか。戦略的にチャネルとメッセージを設計し、確実に届く形をつくります。",
              },
              {
                num: "03",
                title: "長く続ける",
                desc: "一時的な数字ではなく、持続的に売れる仕組みを構築。クライアントのビジネスと共に成長します。",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0, 1] }}
                className="group"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-8">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Image
                      src="/image.jpg"
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute top-4 left-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.4 }}
                  >
                    <span className="text-white/80 text-xs font-medium tracking-[0.3em]">
                      {item.num}
                    </span>
                  </motion.div>
                </div>
                <motion.h3
                  className="text-white mb-4"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 400 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.25 }}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-white/55 leading-[2]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 + 0.4 }}
                >
                  {item.desc}
                </motion.p>
                <motion.div
                  className="h-[1px] bg-white/10 mt-6 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.15 + 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="max-w-[800px] mx-auto">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-white/50 mb-12 uppercase font-medium">
              Vision
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2
              className="text-white mb-12"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300 }}
            >
              売ることは、誇っていい。
              <br />
              いい商品なら、なおさらです。
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-white/60 leading-[2] max-w-[600px]">
              私たちは、クライアントの成功が自分たちの成功だと信じています。
              だからこそ、一つ一つの商品に真摯に向き合い、
              最善の「売れる形」を追求します。
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Company info */}
      <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-white/50 mb-16 uppercase font-medium">
              Company
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <dl className="max-w-[600px] space-y-6">
            {[
              ["社名", "株式会社白器"],
              ["所在地", "東京都"],
              ["事業内容", "マーケティング支援 / ブランド戦略 / コンテンツ企画"],
            ].map(([dt, dd]) => (
              <div
                key={dt}
                className="flex flex-col md:flex-row md:gap-16 py-5 border-b border-white/10"
              >
                <dt className="text-sm text-white/40 md:w-32 shrink-0 mb-1 md:mb-0">
                  {dt}
                </dt>
                <dd className="text-white/75">{dd}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

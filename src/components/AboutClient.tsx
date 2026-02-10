"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function AboutClient() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-[900px]">
          <ScrollReveal>
            <p className="text-sm tracking-[0.3em] text-[#1a1a1a]/50 mb-8 uppercase font-medium">
              About
            </p>
            <h1
              className="text-[#1a1a1a]"
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
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/image.jpg"
                  alt="白器チーム"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="md:w-1/2 flex items-center px-6 md:pl-16 lg:pl-24 md:pr-16 lg:pr-24">
            <div>
              <ScrollReveal>
                <p className="text-[#1a1a1a]/80 leading-[2] text-lg" style={{ fontWeight: 400 }}>
                  白器（はっき）は「白い器」を意味します。
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-[#1a1a1a]/70 leading-[2] mt-8">
                  私たちは白い器のように、クライアントの商品やサービスの本質を受け止め、
                  その価値を正しく届けるマーケティング会社です。
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className="text-[#1a1a1a]/70 leading-[2] mt-6">
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
            background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.08)} 50%, transparent 100%)`,
          }}
        />
        <div className="relative px-6 md:px-16 lg:px-24">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-20 uppercase font-medium">
              Our Values
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {[
              {
                title: "本質を見る",
                desc: "商品やサービスの核にある価値を見つけ出し、言語化します。表面的な訴求ではなく、本当の強みで勝負する。",
              },
              {
                title: "正しく届ける",
                desc: "誰に、どこで、どう伝えるか。戦略的にチャネルとメッセージを設計し、確実に届く形をつくります。",
              },
              {
                title: "長く続ける",
                desc: "一時的な数字ではなく、持続的に売れる仕組みを構築。クライアントのビジネスと共に成長します。",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-8">
                    <Image
                      src="/image.jpg"
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3
                    className="text-[#1a1a1a] mb-4"
                    style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 400 }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#1a1a1a]/65 leading-[2]">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 md:py-40 px-6 md:px-16 lg:px-24">
        <ScrollReveal>
          <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-12 uppercase font-medium">
            Vision
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <h2
            className="text-[#1a1a1a] mb-12 max-w-[800px]"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300 }}
          >
            売ることは、誇っていい。
            <br />
            いい商品なら、なおさらです。
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-[#1a1a1a]/70 leading-[2] max-w-[600px]">
            私たちは、クライアントの成功が自分たちの成功だと信じています。
            だからこそ、一つ一つの商品に真摯に向き合い、
            最善の「売れる形」を追求します。
          </p>
        </ScrollReveal>
      </section>

      {/* Company info */}
      <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24">
        <ScrollReveal>
          <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/50 mb-16 uppercase font-medium">
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
                className="flex flex-col md:flex-row md:gap-16 py-5 border-b border-[#1a1a1a]/10"
              >
                <dt className="text-sm text-[#1a1a1a]/50 md:w-32 shrink-0 mb-1 md:mb-0">
                  {dt}
                </dt>
                <dd className="text-[#1a1a1a]/80">{dd}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </section>
    </div>
  );
}

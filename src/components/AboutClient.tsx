"use client";

import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function AboutClient() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <div>
      {/* Hero — full width bold */}
      <section className="min-h-[70vh] flex items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-[900px]">
          <ScrollReveal>
            <p className="text-sm tracking-[0.3em] text-[#1a1a1a]/30 mb-8 uppercase">
              About
            </p>
            <h1
              className="text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: 200, lineHeight: 1.15 }}
            >
              白い器として、
              <br />
              共に色づく。
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy — with image placeholder */}
      <section className="py-20 md:py-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-0">
          {/* Image placeholder */}
          <div className="md:w-1/2 px-6 md:px-0 md:pl-16 lg:pl-24">
            <ScrollReveal>
              <div className="relative aspect-[3/4] bg-[#1a1a1a]/[0.03] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#1a1a1a]/15 text-sm tracking-wider">
                    スタジオ写真
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Text */}
          <div className="md:w-1/2 flex items-center px-6 md:pl-16 lg:pl-24 md:pr-16 lg:pr-24">
            <div>
              <ScrollReveal>
                <p className="text-[#1a1a1a]/60 leading-[2] text-lg" style={{ fontWeight: 300 }}>
                  Hakkiは「白」を意味します。
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-[#1a1a1a]/50 leading-[2] mt-8">
                  私たちは白い器のように、クライアントのプロジェクトの色に染まり、
                  共に新しい色を生み出すクリエイティブスタジオです。
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className="text-[#1a1a1a]/50 leading-[2] mt-6">
                  一方的にデザインを押し付けるのではなく、
                  対話の中から最適な形を見つけ出す。
                  クライアントの想いに寄り添いながら、
                  デザインとマーケティングの力で、
                  その想いを世界に届けます。
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services detail — bold cards */}
      <section className="py-20 md:py-40 relative">
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.08)} 50%, transparent 100%)`,
          }}
        />
        <div className="relative px-6 md:px-16 lg:px-24">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/30 mb-20 uppercase">
              Services
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {[
              {
                title: "Design",
                desc: "ウェブサイトデザイン、ブランドアイデンティティ、グラフィックデザイン。美しさと機能性を両立させます。",
              },
              {
                title: "Marketing",
                desc: "デジタルマーケティング戦略、コンテンツ企画、SNS運用。データとクリエイティブの融合。",
              },
              {
                title: "Branding",
                desc: "ブランド戦略の策定から、ビジュアルアイデンティティの構築まで。一貫した世界観を。",
              },
            ].map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div className="group">
                  {/* Service image placeholder */}
                  <div className="relative aspect-square bg-[#1a1a1a]/[0.02] mb-8 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-[#1a1a1a]/10 text-sm tracking-wider">
                        {service.title} ビジュアル
                      </p>
                    </div>
                  </div>
                  <h3
                    className="text-[#1a1a1a] mb-4"
                    style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 300 }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-[#1a1a1a]/45 leading-[2]">
                    {service.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision — large typography */}
      <section className="py-20 md:py-40 px-6 md:px-16 lg:px-24">
        <ScrollReveal>
          <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/30 mb-12 uppercase">
            Vision
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <h2
            className="text-[#1a1a1a] mb-12 max-w-[800px]"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 200 }}
          >
            すべてのプロジェクトに、
            <br />
            新しい色を。
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-[#1a1a1a]/50 leading-[2] max-w-[600px]">
            私たちは、クライアントの成功が自分たちの成功だと信じています。
            だからこそ、一つ一つのプロジェクトに真摯に向き合い、
            最善の結果を追求します。
            白い器は、注がれるものによって輝きを増す。
            あなたのプロジェクトと共に、
            私たちも成長し続けます。
          </p>
        </ScrollReveal>
      </section>

      {/* Company info */}
      <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24">
        <ScrollReveal>
          <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/30 mb-16 uppercase">
            Company
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <dl className="max-w-[600px] space-y-6">
            {[
              ["社名", "株式会社Hakki"],
              ["所在地", "東京都"],
              ["事業内容", "デザイン / マーケティング / ブランディング"],
            ].map(([dt, dd]) => (
              <div
                key={dt}
                className="flex flex-col md:flex-row md:gap-16 py-5 border-b border-[#1a1a1a]/5"
              >
                <dt className="text-sm text-[#1a1a1a]/35 md:w-32 shrink-0 mb-1 md:mb-0">
                  {dt}
                </dt>
                <dd className="text-[#1a1a1a]/65">{dd}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </section>
    </div>
  );
}

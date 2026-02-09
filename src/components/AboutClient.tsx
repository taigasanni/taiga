"use client";

import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function AboutClient() {
  const { currentColor, combinedProgress } = useColor();

  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-6 uppercase">
              About
            </p>
            <h1 className="text-[#1a1a1a] mb-8">
              白い器として、
              <br />
              共に色づく。
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <p className="text-[#1a1a1a]/60 leading-[2]">
              Hakkiは「白」を意味します。
              私たちは白い器のように、クライアントのプロジェクトの色に染まり、
              共に新しい色を生み出すクリエイティブスタジオです。
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-[#1a1a1a]/60 leading-[2] mt-8">
              一方的にデザインを押し付けるのではなく、
              対話の中から最適な形を見つけ出す。
              クライアントの想いに寄り添いながら、
              デザインとマーケティングの力で、
              その想いを世界に届けます。
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-20 md:py-32 px-6 relative">
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${hslToString(currentColor, combinedProgress * 0.08)} 50%, transparent 100%)`,
          }}
        />
        <div className="relative max-w-[700px] mx-auto">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-16 uppercase">
              Services
            </p>
          </ScrollReveal>

          <div className="space-y-20">
            <ScrollReveal>
              <div>
                <h3 className="text-[#1a1a1a] mb-6">Design</h3>
                <p className="text-[#1a1a1a]/50 leading-[2]">
                  ウェブサイトデザイン、ブランドアイデンティティ、グラフィックデザイン。
                  美しさと機能性を両立し、ブランドの本質を視覚化します。
                  ミニマルで洗練されたデザインを通じて、
                  メッセージが直感的に伝わる体験を設計します。
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div>
                <h3 className="text-[#1a1a1a] mb-6">Marketing</h3>
                <p className="text-[#1a1a1a]/50 leading-[2]">
                  デジタルマーケティング戦略、コンテンツ企画、SNS運用。
                  データに基づく戦略と、クリエイティブの力で、
                  ブランドのメッセージを適切なオーディエンスに届けます。
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div>
                <h3 className="text-[#1a1a1a] mb-6">Branding</h3>
                <p className="text-[#1a1a1a]/50 leading-[2]">
                  ブランド戦略の策定から、ビジュアルアイデンティティの構築まで。
                  企業の核となる価値を見つけ出し、
                  一貫した世界観で表現します。
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-16 uppercase">
              Vision
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-[#1a1a1a] mb-8">
              すべてのプロジェクトに、
              <br />
              新しい色を。
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-[#1a1a1a]/50 leading-[2]">
              私たちは、クライアントの成功が自分たちの成功だと信じています。
              だからこそ、一つ一つのプロジェクトに真摯に向き合い、
              最善の結果を追求します。
              白い器は、注がれるものによって輝きを増す。
              あなたのプロジェクトと共に、
              私たちも成長し続けます。
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Company info */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-16 uppercase">
              Company
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <dl className="space-y-6">
              {[
                ["社名", "株式会社Hakki"],
                ["所在地", "東京都"],
                ["事業内容", "デザイン / マーケティング / ブランディング"],
              ].map(([dt, dd]) => (
                <div
                  key={dt}
                  className="flex flex-col md:flex-row md:gap-16 py-4 border-b border-[#1a1a1a]/5"
                >
                  <dt className="text-sm text-[#1a1a1a]/40 md:w-32 shrink-0 mb-1 md:mb-0">
                    {dt}
                  </dt>
                  <dd className="text-[#1a1a1a]/70">{dd}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

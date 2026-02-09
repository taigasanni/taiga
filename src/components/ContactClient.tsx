"use client";

import { useState, type FormEvent } from "react";
import ScrollReveal from "./ScrollReveal";
import { useColor } from "@/lib/ColorContext";
import { hslToString } from "@/lib/colorUtils";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const { currentColor, combinedProgress } = useColor();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-transition">
      {/* Dye overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, ${hslToString(currentColor, combinedProgress * 0.15)} 0%, transparent 60%)`,
        }}
      />

      <section className="min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-[500px] mx-auto w-full">
          <ScrollReveal>
            <p className="text-sm tracking-[0.2em] text-[#1a1a1a]/40 mb-4 uppercase">
              Contact
            </p>
            <h1 className="text-[#1a1a1a] mb-6">お問い合わせ</h1>
            <p className="text-[#1a1a1a]/40 mb-16 text-sm leading-relaxed">
              プロジェクトのご相談、お見積りなど、
              <br />
              お気軽にご連絡ください。
            </p>
          </ScrollReveal>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-10">
              <ScrollReveal delay={0.1}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-[#1a1a1a]/40 mb-3"
                  >
                    お名前
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-[#1a1a1a]/10 pb-3 text-[#1a1a1a] outline-none focus:border-[#1a1a1a]/30 transition-colors duration-300 text-base"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-[#1a1a1a]/40 mb-3"
                  >
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-[#1a1a1a]/10 pb-3 text-[#1a1a1a] outline-none focus:border-[#1a1a1a]/30 transition-colors duration-300 text-base"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-[#1a1a1a]/40 mb-3"
                  >
                    メッセージ
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full bg-transparent border-b border-[#1a1a1a]/10 pb-3 text-[#1a1a1a] outline-none focus:border-[#1a1a1a]/30 transition-colors duration-300 text-base resize-none"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                <button
                  type="submit"
                  className="text-sm tracking-[0.15em] text-[#1a1a1a]/60 border-b border-[#1a1a1a]/15 pb-1 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30 transition-all duration-300 bg-transparent cursor-pointer"
                >
                  送信する
                </button>
              </ScrollReveal>
            </form>
          ) : (
            <ScrollReveal>
              <div className="text-center py-16">
                <p className="text-[#1a1a1a]/60 leading-relaxed">
                  メッセージを受け付けました。
                  <br />
                  ありがとうございます。
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}

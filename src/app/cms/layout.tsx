import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS — 白器",
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa]" style={{ cursor: "auto" }}>
      <header className="border-b border-[#e5e5e5] bg-white sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#1a1a1a]">白器 CMS</span>
            <span className="text-xs text-[#1a1a1a]/40 bg-[#f0f0f0] px-2 py-0.5 rounded">
              Journal管理
            </span>
          </div>
          <a
            href="/"
            className="text-xs text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70 transition-colors no-underline"
          >
            サイトに戻る
          </a>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

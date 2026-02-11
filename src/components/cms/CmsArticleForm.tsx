"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  slug: string;
  title: string;
  date: string;
  category: "Design" | "Marketing";
  excerpt: string;
  content: string;
  themeColor: { h: number; s: number; l: number };
  eyecatch: string;
  eyecatchAlt: string;
}

interface Props {
  initialData?: Partial<FormData>;
  mode: "create" | "edit";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u3000-\u9fff-]/g, "")
    .replace(/[\s\u3000]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function CmsArticleForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState<FormData>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    date:
      initialData?.date ||
      new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    category: initialData?.category || "Marketing",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    themeColor: initialData?.themeColor || { h: 200, s: 20, l: 85 },
    eyecatch: initialData?.eyecatch || "/image.jpg",
    eyecatchAlt: initialData?.eyecatchAlt || "",
  });

  const update = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (title: string) => {
    update("title", title);
    if (mode === "create") {
      update("slug", generateSlug(title));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("タイトルと本文は必須です");
      return;
    }
    if (!form.slug.trim()) {
      setError("スラッグは必須です");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url =
        mode === "create"
          ? "/api/journal"
          : `/api/journal/${initialData?.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存に失敗しました");
      }

      router.push("/cms");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  // Simple preview renderer
  const renderPreview = () => {
    const paragraphs = form.content.split("\n\n").filter(Boolean);
    return paragraphs.map((p, i) => {
      const h2 = p.match(/^<h2>(.*?)<\/h2>$/);
      const h3 = p.match(/^<h3>(.*?)<\/h3>$/);
      const h4 = p.match(/^<h4>(.*?)<\/h4>$/);
      if (h2)
        return (
          <h2 key={i} className="text-xl font-light mt-10 mb-4 text-[#1a1a1a]">
            {h2[1]}
          </h2>
        );
      if (h3)
        return (
          <h3
            key={i}
            className="text-lg font-normal mt-8 mb-3 text-[#1a1a1a]/90"
          >
            {h3[1]}
          </h3>
        );
      if (h4)
        return (
          <h4
            key={i}
            className="text-base font-medium mt-6 mb-2 text-[#1a1a1a]/85"
          >
            {h4[1]}
          </h4>
        );
      return (
        <p key={i} className="text-[#1a1a1a]/70 leading-[2] mb-4">
          {p}
        </p>
      );
    });
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/cms")}
          className="text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors bg-transparent border-0 cursor-pointer"
        >
          ← 記事一覧に戻る
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-[#1a1a1a]/60 border border-[#e5e5e5] px-4 py-2 rounded-lg hover:bg-[#f5f5f5] transition-colors bg-white cursor-pointer"
          >
            {showPreview ? "編集に戻る" : "プレビュー"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm text-white bg-[#1a1a1a] px-5 py-2 rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 border-0 cursor-pointer"
          >
            {saving
              ? "保存中..."
              : mode === "create"
                ? "記事を作成"
                : "変更を保存"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {showPreview ? (
        /* Preview mode */
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 md:p-12">
          <div className="max-w-[700px]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-[#1a1a1a]/40">{form.category}</span>
              <span className="text-xs text-[#1a1a1a]/30">{form.date}</span>
            </div>
            <h1 className="text-2xl font-light text-[#1a1a1a] mb-8">
              {form.title}
            </h1>
            <div>{renderPreview()}</div>
          </div>
        </div>
      ) : (
        /* Edit mode */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main editor */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="記事のタイトル"
                className="w-full text-lg border border-[#e5e5e5] rounded-lg px-4 py-3 outline-none focus:border-[#1a1a1a]/30 transition-colors"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">
                概要（excerpt）
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="記事の概要を入力..."
                rows={2}
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 outline-none focus:border-[#1a1a1a]/30 transition-colors resize-none text-sm"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-[#1a1a1a]/50">
                  本文
                </label>
                <span className="text-xs text-[#1a1a1a]/30">
                  {"<h2>, <h3>, <h4> タグが使えます"}
                </span>
              </div>
              <textarea
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder="記事の本文を入力..."
                rows={25}
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 outline-none focus:border-[#1a1a1a]/30 transition-colors resize-y text-sm leading-relaxed font-mono"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">
                スラッグ (URL)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="article-slug"
                disabled={mode === "edit"}
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]/30 transition-colors disabled:bg-[#f5f5f5] disabled:text-[#1a1a1a]/40 font-mono"
              />
              <p className="text-xs text-[#1a1a1a]/30 mt-1.5">
                /journal/{form.slug || "..."}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">
                日付
              </label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                placeholder="2025.01.01"
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]/30 transition-colors"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">
                カテゴリ
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  update("category", e.target.value as "Design" | "Marketing")
                }
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]/30 transition-colors bg-white"
              >
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">
                アイキャッチ画像パス
              </label>
              <input
                type="text"
                value={form.eyecatch}
                onChange={(e) => update("eyecatch", e.target.value)}
                placeholder="/image.jpg"
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]/30 transition-colors"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-3">
                テーマカラー (HSL)
              </label>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#1a1a1a]/40">H (色相)</span>
                    <span className="text-xs text-[#1a1a1a]/50 font-mono">
                      {form.themeColor.h}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={form.themeColor.h}
                    onChange={(e) =>
                      update("themeColor", {
                        ...form.themeColor,
                        h: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#1a1a1a]/40">
                      S (彩度)
                    </span>
                    <span className="text-xs text-[#1a1a1a]/50 font-mono">
                      {form.themeColor.s}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.themeColor.s}
                    onChange={(e) =>
                      update("themeColor", {
                        ...form.themeColor,
                        s: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#1a1a1a]/40">
                      L (明度)
                    </span>
                    <span className="text-xs text-[#1a1a1a]/50 font-mono">
                      {form.themeColor.l}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.themeColor.l}
                    onChange={(e) =>
                      update("themeColor", {
                        ...form.themeColor,
                        l: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div
                  className="h-8 rounded-md border border-[#e5e5e5]"
                  style={{
                    backgroundColor: `hsl(${form.themeColor.h}, ${form.themeColor.s}%, ${form.themeColor.l}%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

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

/** Convert old \n\n-based content to HTML for the editor */
function convertLegacyToHtml(content: string): string {
  // Already HTML (from Tiptap) — contains <p> tags
  if (content.includes("<p>")) return content;
  // Empty
  if (!content.trim()) return "";

  const blocks = content.split("\n\n").filter(Boolean);
  return blocks
    .map((b) => {
      const t = b.trim();
      // Block-level tags: keep as-is
      if (
        t.startsWith("<h2>") ||
        t.startsWith("<h3>") ||
        t.startsWith("<h4>") ||
        t.startsWith("<ul>") ||
        t.startsWith("<ol>") ||
        t.startsWith("<table>") ||
        t.startsWith("<img") ||
        t.startsWith("<blockquote>") ||
        t.startsWith("<hr")
      ) {
        return t;
      }
      // Wrap plain text in <p>
      return `<p>${t}</p>`;
    })
    .join("");
}

export default function CmsArticleForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const eyecatchInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>(() => ({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    date:
      initialData?.date ||
      new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    category: initialData?.category || "Marketing",
    excerpt: initialData?.excerpt || "",
    content: convertLegacyToHtml(initialData?.content || ""),
    themeColor: initialData?.themeColor || { h: 200, s: 20, l: 85 },
    eyecatch: initialData?.eyecatch || "",
    eyecatchAlt: initialData?.eyecatchAlt || "",
  }));

  const update = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (title: string) => {
    update("title", title);
    if (mode === "create") {
      update("slug", generateSlug(title));
    }
  };

  // ── Image upload ──
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "アップロードに失敗しました");
        return null;
      }
      const data = await res.json();
      return data.path as string;
    } catch {
      setError("アップロードに失敗しました");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleEyecatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const p = await uploadFile(file);
    if (p) {
      update("eyecatch", p);
      if (!form.eyecatchAlt) update("eyecatchAlt", form.title || file.name);
    }
    e.target.value = "";
  };

  // ── Save ──
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
        mode === "create" ? "/api/journal" : `/api/journal/${initialData?.slug}`;
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

  return (
    <div>
      <input ref={eyecatchInputRef} type="file" accept="image/*" onChange={handleEyecatchUpload} className="hidden" />

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
            {saving ? "保存中..." : mode === "create" ? "記事を作成" : "変更を保存"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}
      {uploading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600">
          画像をアップロード中...
        </div>
      )}

      {showPreview ? (
        /* ── Preview: render HTML as it would appear on the article page ── */
        <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-8 md:p-12">
          <div className="max-w-[700px] mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-white/40">{form.category}</span>
              <span className="text-xs text-white/30">{form.date}</span>
            </div>
            <h1 className="text-2xl font-light text-white mb-8">{form.title}</h1>
            {form.eyecatch && (
              <div className="mb-8 relative aspect-[2/1] bg-white/5 overflow-hidden rounded-md">
                <Image src={form.eyecatch} alt={form.eyecatchAlt || form.title} fill className="object-cover" />
              </div>
            )}
            <div
              className="article-html"
              dangerouslySetInnerHTML={{ __html: form.content }}
            />
          </div>
        </div>
      ) : (
        /* ── Editor mode ── */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main editor */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">タイトル</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="記事のタイトル"
                className="w-full text-lg border border-[#e5e5e5] rounded-lg px-4 py-3 outline-none focus:border-[#1a1a1a]/30 transition-colors"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">概要（excerpt）</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="記事の概要を入力..."
                rows={2}
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 outline-none focus:border-[#1a1a1a]/30 transition-colors resize-none text-sm"
              />
            </div>

            {/* Visual rich-text editor */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-3">本文</label>
              <RichEditor
                content={form.content}
                onChange={(html) => update("content", html)}
                onUploadImage={uploadFile}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Slug */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">スラッグ (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="article-slug"
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]/30 transition-colors font-mono"
              />
              <p className="text-xs text-[#1a1a1a]/30 mt-1.5">/journal/{form.slug || "..."}</p>
            </div>

            {/* Eyecatch */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-3">アイキャッチ画像</label>
              {form.eyecatch ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] bg-[#f5f5f5] rounded-lg overflow-hidden">
                    <Image src={form.eyecatch} alt={form.eyecatchAlt || "eyecatch"} fill className="object-cover" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => eyecatchInputRef.current?.click()}
                      className="text-xs text-[#1a1a1a]/60 border border-[#e5e5e5] px-3 py-1.5 rounded-md hover:bg-[#f5f5f5] transition-colors bg-white cursor-pointer"
                    >
                      変更
                    </button>
                    <button
                      type="button"
                      onClick={() => update("eyecatch", "")}
                      className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors bg-white cursor-pointer"
                    >
                      削除
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.eyecatchAlt}
                    onChange={(e) => update("eyecatchAlt", e.target.value)}
                    placeholder="画像の説明 (alt)"
                    className="w-full border border-[#e5e5e5] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#1a1a1a]/30 transition-colors"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => eyecatchInputRef.current?.click()}
                  className="w-full aspect-[16/9] border-2 border-dashed border-[#e5e5e5] rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[#1a1a1a]/20 transition-colors cursor-pointer bg-[#fafafa]"
                >
                  <span className="text-2xl text-[#1a1a1a]/20">+</span>
                  <span className="text-xs text-[#1a1a1a]/40">画像をアップロード</span>
                </button>
              )}
            </div>

            {/* Date */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">日付</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                placeholder="2025.01.01"
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]/30 transition-colors"
              />
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-2">カテゴリ</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value as "Design" | "Marketing")}
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a1a1a]/30 transition-colors bg-white"
              >
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
              </select>
            </div>

            {/* Theme Color */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-3">テーマカラー (HSL)</label>
              <div className="space-y-3">
                {(["h", "s", "l"] as const).map((key) => {
                  const labels = { h: "H (色相)", s: "S (彩度)", l: "L (明度)" };
                  const maxVal = key === "h" ? 360 : 100;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#1a1a1a]/40">{labels[key]}</span>
                        <span className="text-xs text-[#1a1a1a]/50 font-mono">{form.themeColor[key]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxVal}
                        value={form.themeColor[key]}
                        onChange={(e) =>
                          update("themeColor", { ...form.themeColor, [key]: Number(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                  );
                })}
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

"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const eyecatchInputRef = useRef<HTMLInputElement>(null);
  const bodyImageInputRef = useRef<HTMLInputElement>(null);

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
    eyecatch: initialData?.eyecatch || "",
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

  // ── Image upload ──
  const uploadFile = async (file: File): Promise<string | null> => {
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
  };

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

  // ── Toolbar: insert at cursor ──
  const insertAtCursor = useCallback(
    (before: string, after: string = "") => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = form.content;
      const selected = text.slice(start, end);
      const inserted = before + selected + after;
      const newContent = text.slice(0, start) + inserted + text.slice(end);
      update("content", newContent);
      requestAnimationFrame(() => {
        ta.focus();
        const cur = start + before.length + selected.length;
        ta.setSelectionRange(cur, cur);
      });
    },
    [form.content]
  );

  const handleBold = () => insertAtCursor("<strong>", "</strong>");
  const handleList = () =>
    insertAtCursor("\n\n<ul>\n<li>項目1</li>\n<li>項目2</li>\n<li>項目3</li>\n</ul>\n\n");
  const handleTable = () =>
    insertAtCursor(
      "\n\n<table>\n<tr><th>見出し1</th><th>見出し2</th><th>見出し3</th></tr>\n<tr><td>データ1</td><td>データ2</td><td>データ3</td></tr>\n<tr><td>データ4</td><td>データ5</td><td>データ6</td></tr>\n</table>\n\n"
    );
  const handleHeading = (tag: string) => insertAtCursor(`\n\n<${tag}>`, `</${tag}>\n\n`);

  const handleBodyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const p = await uploadFile(file);
    if (p) {
      insertAtCursor(`\n\n<img src="${p}" alt="${file.name.replace(/\.[^.]+$/, "")}" />\n\n`);
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

  // ── Inline renderer ──
  const renderInline = (text: string) => {
    const parts: React.ReactNode[] = [];
    let rem = text;
    let k = 0;
    while (rem.length > 0) {
      const sm = rem.match(/<strong>(.*?)<\/strong>/);
      if (sm && sm.index !== undefined) {
        if (sm.index > 0) parts.push(rem.slice(0, sm.index));
        parts.push(<strong key={k++} className="font-semibold">{sm[1]}</strong>);
        rem = rem.slice(sm.index + sm[0].length);
      } else {
        parts.push(rem);
        break;
      }
    }
    return parts;
  };

  // ── Preview renderer ──
  const renderPreview = () => {
    const blocks = form.content.split("\n\n").filter(Boolean);
    const nodes: React.ReactNode[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i].trim();
      const h2 = b.match(/^<h2>([\s\S]*?)<\/h2>$/);
      if (h2) { nodes.push(<h2 key={i} className="text-xl font-light mt-10 mb-4 text-[#1a1a1a]">{h2[1]}</h2>); continue; }
      const h3 = b.match(/^<h3>([\s\S]*?)<\/h3>$/);
      if (h3) { nodes.push(<h3 key={i} className="text-lg font-normal mt-8 mb-3 text-[#1a1a1a]/90">{h3[1]}</h3>); continue; }
      const h4 = b.match(/^<h4>([\s\S]*?)<\/h4>$/);
      if (h4) { nodes.push(<h4 key={i} className="text-base font-medium mt-6 mb-2 text-[#1a1a1a]/85">{h4[1]}</h4>); continue; }
      const img = b.match(/^<img\s+src="([^"]*)"(?:\s+alt="([^"]*)")?\s*\/?>$/);
      if (img) { nodes.push(<div key={i} className="my-8"><img src={img[1]} alt={img[2] || ""} className="w-full rounded-md" /></div>); continue; }
      if (b.startsWith("<ul>") || b.startsWith("<ul ")) {
        const items = [...b.matchAll(/<li>(.*?)<\/li>/g)].map((m) => m[1]);
        nodes.push(
          <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-[#1a1a1a]/70 leading-[2]">
            {items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
          </ul>
        );
        continue;
      }
      if (b.startsWith("<table>") || b.startsWith("<table ")) {
        const rows = [...b.matchAll(/<tr>(.*?)<\/tr>/g)].map((m) => m[1]);
        nodes.push(
          <div key={i} className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {rows.map((row, ri) => {
                  const isH = row.includes("<th>");
                  const cells = isH
                    ? [...row.matchAll(/<th>(.*?)<\/th>/g)].map((m) => m[1])
                    : [...row.matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]);
                  return (
                    <tr key={ri} className={isH ? "border-b-2 border-[#1a1a1a]/10" : "border-b border-[#1a1a1a]/5"}>
                      {cells.map((c, ci) =>
                        isH
                          ? <th key={ci} className="text-left py-2.5 px-3 font-medium text-[#1a1a1a]/80">{renderInline(c)}</th>
                          : <td key={ci} className="py-2.5 px-3 text-[#1a1a1a]/65">{renderInline(c)}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
      nodes.push(<p key={i} className="text-[#1a1a1a]/70 leading-[2] mb-4">{renderInline(b)}</p>);
    }
    return nodes;
  };

  const ToolBtn = ({ label, onClick, title }: { label: string; onClick: () => void; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-3 py-1.5 text-xs border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5] transition-colors bg-white cursor-pointer text-[#1a1a1a]/70 font-medium"
    >
      {label}
    </button>
  );

  return (
    <div>
      <input ref={eyecatchInputRef} type="file" accept="image/*" onChange={handleEyecatchUpload} className="hidden" />
      <input ref={bodyImageInputRef} type="file" accept="image/*" onChange={handleBodyImage} className="hidden" />

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
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 md:p-12">
          <div className="max-w-[700px]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-[#1a1a1a]/40">{form.category}</span>
              <span className="text-xs text-[#1a1a1a]/30">{form.date}</span>
            </div>
            <h1 className="text-2xl font-light text-[#1a1a1a] mb-8">{form.title}</h1>
            {form.eyecatch && (
              <div className="mb-8 relative aspect-[2/1] bg-[#f5f5f5] overflow-hidden rounded-md">
                <Image src={form.eyecatch} alt={form.eyecatchAlt || form.title} fill className="object-cover" />
              </div>
            )}
            <div>{renderPreview()}</div>
          </div>
        </div>
      ) : (
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

            {/* Content with toolbar */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-3">本文</label>
              <div className="flex flex-wrap items-center gap-1.5 mb-3 pb-3 border-b border-[#e5e5e5]">
                <ToolBtn label="B" onClick={handleBold} title="太字 <strong>" />
                <span className="w-px h-5 bg-[#e5e5e5]" />
                <ToolBtn label="H2" onClick={() => handleHeading("h2")} title="見出し2" />
                <ToolBtn label="H3" onClick={() => handleHeading("h3")} title="見出し3" />
                <ToolBtn label="H4" onClick={() => handleHeading("h4")} title="見出し4" />
                <span className="w-px h-5 bg-[#e5e5e5]" />
                <ToolBtn label="箇条書き" onClick={handleList} title="箇条書きリスト" />
                <ToolBtn label="表" onClick={handleTable} title="テーブル挿入" />
                <span className="w-px h-5 bg-[#e5e5e5]" />
                <ToolBtn label="画像挿入" onClick={() => bodyImageInputRef.current?.click()} title="本文に画像を挿入" />
              </div>
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder="記事の本文を入力..."
                rows={25}
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 outline-none focus:border-[#1a1a1a]/30 transition-colors resize-y text-sm leading-relaxed font-mono"
              />
              <p className="mt-2 text-xs text-[#1a1a1a]/30">
                ツールバーでリッチコンテンツを挿入 / 段落はダブル改行で区切り
              </p>
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

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useRef, useCallback, useEffect, useState } from "react";

/* Some Tiptap extensions have inconsistent ESM export handling in Turbopack.
   Use wildcard imports and pick either the named export or default. */
import * as TableMod from "@tiptap/extension-table";
import * as HighlightMod from "@tiptap/extension-highlight";
import * as UnderlineMod from "@tiptap/extension-underline";
import * as TextAlignMod from "@tiptap/extension-text-align";
import * as LinkMod from "@tiptap/extension-link";
import * as ColorMod from "@tiptap/extension-color";
import * as TextStyleMod from "@tiptap/extension-text-style";
import * as PlaceholderMod from "@tiptap/extension-placeholder";

const Table = (TableMod as Record<string, unknown>).Table ?? (TableMod as Record<string, unknown>).default;
const Highlight = (HighlightMod as Record<string, unknown>).Highlight ?? (HighlightMod as Record<string, unknown>).default;
const Underline = (UnderlineMod as Record<string, unknown>).Underline ?? (UnderlineMod as Record<string, unknown>).default;
const TextAlign = (TextAlignMod as Record<string, unknown>).TextAlign ?? (TextAlignMod as Record<string, unknown>).default;
const TiptapLink = (LinkMod as Record<string, unknown>).Link ?? (LinkMod as Record<string, unknown>).default;
const Color = (ColorMod as Record<string, unknown>).Color ?? (ColorMod as Record<string, unknown>).default;
const TextStyle = (TextStyleMod as Record<string, unknown>).TextStyle ?? (TextStyleMod as Record<string, unknown>).default;
const Placeholder = (PlaceholderMod as Record<string, unknown>).Placeholder ?? (PlaceholderMod as Record<string, unknown>).default;

interface Props {
  content: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

/* ── SVG Icon Components ── */
const IconBold = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
);
const IconItalic = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
);
const IconUnderline = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
);
const IconHighlight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
const IconLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);
const IconAlignLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
);
const IconAlignCenter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="5" y1="18" x2="19" y2="18"/></svg>
);
const IconAlignRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
);
const IconBulletList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
);
const IconOrderedList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text><text x="2" y="14" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text><text x="2" y="20" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text></svg>
);
const IconBlockquote = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/></svg>
);
const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const IconTable = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
);
const IconHR = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
);
const IconUndo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
);
const IconRedo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
);

const HIGHLIGHT_COLORS = [
  { label: "黄色", color: "#fef08a" },
  { label: "緑", color: "#bbf7d0" },
  { label: "青", color: "#bfdbfe" },
  { label: "ピンク", color: "#fecdd3" },
  { label: "紫", color: "#e9d5ff" },
  { label: "オレンジ", color: "#fed7aa" },
];

const TEXT_COLORS = [
  { label: "デフォルト", color: "" },
  { label: "赤", color: "#ef4444" },
  { label: "オレンジ", color: "#f97316" },
  { label: "緑", color: "#22c55e" },
  { label: "青", color: "#3b82f6" },
  { label: "紫", color: "#a855f7" },
  { label: "グレー", color: "#6b7280" },
];

export default function RichEditor({ content, onChange, onUploadImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: "rich-img" },
      }),
      (Table as any).configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      (Highlight as any).configure({ multicolor: true }),
      Underline as any,
      (TextAlign as any).configure({
        types: ["heading", "paragraph"],
      }),
      (TiptapLink as any).configure({
        openOnClick: false,
        HTMLAttributes: { class: "rich-link" },
      }),
      TextStyle as any,
      Color as any,
      (Placeholder as any).configure({
        placeholder: "記事の本文を入力してください...",
      }),
    ],
    content,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-body",
      },
    },
  });

  // Sync external content changes
  const initialRef = useRef(content);
  useEffect(() => {
    if (editor && content !== initialRef.current) {
      editor.commands.setContent(content);
      initialRef.current = content;
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      const url = await onUploadImage(file);
      if (url) {
        editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
      }
      e.target.value = "";
    },
    [editor, onUploadImage]
  );

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const openLinkInput = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    setLinkUrl(prev);
    setShowLinkInput(true);
  }, [editor]);

  if (!editor) return null;

  /* ── Toolbar Button ── */
  const Btn = ({
    children,
    onClick,
    active = false,
    disabled = false,
    title,
    className: extra = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    className?: string;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150 cursor-pointer ${
        active
          ? "bg-[#1a1a1a] text-white shadow-sm"
          : disabled
          ? "text-[#1a1a1a]/20 cursor-not-allowed"
          : "text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/8 hover:text-[#1a1a1a]"
      } ${extra}`}
    >
      {children}
    </button>
  );

  /* ── Heading dropdown button ── */
  const HeadingBtn = ({ level }: { level: 2 | 3 | 4 }) => {
    const sizes = { 2: "text-[11px]", 3: "text-[10px]", 4: "text-[9px]" };
    return (
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        active={editor.isActive("heading", { level })}
        title={`見出し${level}`}
      >
        <span className={`font-bold leading-none ${sizes[level]}`}>H{level}</span>
      </Btn>
    );
  };

  const Sep = () => <span className="w-px h-5 bg-[#e5e5e5] mx-1 shrink-0" />;

  return (
    <div className="rich-editor-wrapper rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* ── Main Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-[#f8f8f8] border-b border-[#e5e5e5] sticky top-0 z-10">
        {/* Undo/Redo */}
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="元に戻す (Ctrl+Z)"
        >
          <IconUndo />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="やり直す (Ctrl+Shift+Z)"
        >
          <IconRedo />
        </Btn>

        <Sep />

        {/* Headings */}
        <HeadingBtn level={2} />
        <HeadingBtn level={3} />
        <HeadingBtn level={4} />

        <Sep />

        {/* Inline formatting */}
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="太字 (Ctrl+B)"
        >
          <IconBold />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="斜体 (Ctrl+I)"
        >
          <IconItalic />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="下線 (Ctrl+U)"
        >
          <IconUnderline />
        </Btn>

        {/* Highlight picker */}
        <div className="relative">
          <Btn
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
            }}
            active={editor.isActive("highlight")}
            title="マーカー"
          >
            <IconHighlight />
            <span
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
              style={{
                backgroundColor: editor.getAttributes("highlight").color || "#fef08a",
              }}
            />
          </Btn>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg p-2 z-50 flex gap-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  title={c.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color: c.color }).run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-7 h-7 rounded-md border border-[#e5e5e5] cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.color }}
                />
              ))}
              {editor.isActive("highlight") && (
                <button
                  type="button"
                  title="マーカーを削除"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-7 h-7 rounded-md border border-[#e5e5e5] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-[10px] text-[#999] bg-white"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Text color picker */}
        <div className="relative">
          <Btn
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
            }}
            active={!!editor.getAttributes("textStyle").color}
            title="文字色"
          >
            <span className="text-sm font-bold leading-none">A</span>
            <span
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
              style={{
                backgroundColor: editor.getAttributes("textStyle").color || "#1a1a1a",
              }}
            />
          </Btn>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg p-2 z-50 flex gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.color || "default"}
                  type="button"
                  title={c.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (c.color) {
                      editor.chain().focus().setColor(c.color).run();
                    } else {
                      editor.chain().focus().unsetColor().run();
                    }
                    setShowColorPicker(false);
                  }}
                  className="w-7 h-7 rounded-md border border-[#e5e5e5] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                  style={{ backgroundColor: c.color || "#fff" }}
                >
                  {!c.color && <span className="text-[10px] text-[#999]">Aa</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <Sep />

        {/* Link */}
        <div className="relative">
          <Btn
            onClick={openLinkInput}
            active={editor.isActive("link")}
            title="リンク"
          >
            <IconLink />
          </Btn>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg p-3 z-50 flex gap-2 items-center">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSetLink(); if (e.key === "Escape") setShowLinkInput(false); }}
                placeholder="https://..."
                className="w-56 text-sm border border-[#e5e5e5] rounded-md px-3 py-1.5 outline-none focus:border-[#1a1a1a]/30"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSetLink}
                className="text-xs bg-[#1a1a1a] text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#333]"
              >
                OK
              </button>
              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setShowLinkInput(false);
                  }}
                  className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-md cursor-pointer hover:bg-red-50"
                >
                  解除
                </button>
              )}
            </div>
          )}
        </div>

        <Sep />

        {/* Alignment */}
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="左揃え"
        >
          <IconAlignLeft />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="中央揃え"
        >
          <IconAlignCenter />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="右揃え"
        >
          <IconAlignRight />
        </Btn>

        <Sep />

        {/* Lists */}
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="箇条書き"
        >
          <IconBulletList />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="番号付き"
        >
          <IconOrderedList />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="引用"
        >
          <IconBlockquote />
        </Btn>

        <Sep />

        {/* Table */}
        <Btn
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          title="テーブル挿入"
        >
          <IconTable />
        </Btn>
        {editor.isActive("table") && (
          <>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="行を追加"
              className="px-1.5 py-1 text-[10px] rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer font-medium"
            >
              +行
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="列を追加"
              className="px-1.5 py-1 text-[10px] rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer font-medium"
            >
              +列
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="行を削除"
              className="px-1.5 py-1 text-[10px] rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer font-medium"
            >
              -行
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="列を削除"
              className="px-1.5 py-1 text-[10px] rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer font-medium"
            >
              -列
            </button>
          </>
        )}

        <Sep />

        {/* Image */}
        <Btn onClick={() => fileInputRef.current?.click()} title="画像アップロード">
          <IconImage />
        </Btn>

        {/* Horizontal rule */}
        <Btn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="区切り線"
        >
          <IconHR />
        </Btn>
      </div>

      {/* ── Editor Area ── */}
      <EditorContent editor={editor} className="tiptap-editor" />

      {/* Close pickers on outside click */}
      {(showHighlightPicker || showColorPicker || showLinkInput) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowHighlightPicker(false);
            setShowColorPicker(false);
            setShowLinkInput(false);
          }}
        />
      )}
    </div>
  );
}

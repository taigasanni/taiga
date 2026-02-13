"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useRef, useCallback, useEffect } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

export default function RichEditor({ content, onChange, onUploadImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: "rich-img" },
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
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

  // Sync external content changes (e.g. on route load)
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

  if (!editor) return null;

  const Btn = ({
    label,
    onClick,
    active = false,
    title,
  }: {
    label: string;
    onClick: () => void;
    active?: boolean;
    title: string;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer font-medium leading-none ${
        active
          ? "bg-[#1a1a1a] text-white"
          : "text-[#1a1a1a]/60 hover:bg-[#f0f0f0]"
      }`}
    >
      {label}
    </button>
  );

  const Sep = () => <span className="w-px h-5 bg-[#e5e5e5] mx-0.5" />;

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#e5e5e5] bg-[#fafafa] rounded-t-lg">
        <Btn
          label="B"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="太字"
        />
        <Btn
          label="I"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="斜体"
        />
        <Sep />
        <Btn
          label="H2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="見出し2"
        />
        <Btn
          label="H3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="見出し3"
        />
        <Btn
          label="H4"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive("heading", { level: 4 })}
          title="見出し4"
        />
        <Sep />
        <Btn
          label="箇条書き"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="箇条書きリスト"
        />
        <Btn
          label="番号付き"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="番号付きリスト"
        />
        <Sep />
        <Btn
          label="表"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          title="テーブル挿入"
        />
        {editor.isActive("table") && (
          <>
            <Btn
              label="+行"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="行を追加"
            />
            <Btn
              label="+列"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="列を追加"
            />
            <Btn
              label="-行"
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="行を削除"
            />
            <Btn
              label="-列"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="列を削除"
            />
          </>
        )}
        <Sep />
        <Btn
          label="画像"
          onClick={() => fileInputRef.current?.click()}
          title="画像をアップロード"
        />
        <Sep />
        <Btn
          label="―"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="区切り線"
        />
        <Btn
          label="引用"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="引用ブロック"
        />
      </div>

      {/* Editor area */}
      <div className="border border-t-0 border-[#e5e5e5] rounded-b-lg">
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  );
}

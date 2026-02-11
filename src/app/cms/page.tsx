"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Entry {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

export default function CmsDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    const res = await fetch("/api/journal");
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`「${slug}」を削除しますか？`)) return;
    await fetch(`/api/journal/${slug}`, { method: "DELETE" });
    fetchEntries();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#1a1a1a]/40">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">記事一覧</h1>
          <p className="text-sm text-[#1a1a1a]/50 mt-1">
            {entries.length}件の記事
          </p>
        </div>
        <Link
          href="/cms/new"
          className="bg-[#1a1a1a] text-white text-sm px-5 py-2.5 rounded-lg no-underline hover:bg-[#333] transition-colors"
        >
          新しい記事を作成
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[#1a1a1a]/40">記事がありません</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                <th className="text-left text-xs font-medium text-[#1a1a1a]/50 px-5 py-3">
                  タイトル
                </th>
                <th className="text-left text-xs font-medium text-[#1a1a1a]/50 px-5 py-3 w-28">
                  カテゴリ
                </th>
                <th className="text-left text-xs font-medium text-[#1a1a1a]/50 px-5 py-3 w-28">
                  日付
                </th>
                <th className="text-right text-xs font-medium text-[#1a1a1a]/50 px-5 py-3 w-32">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.slug}
                  className="border-b border-[#e5e5e5] last:border-0 hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#1a1a1a] truncate max-w-md">
                      {entry.title}
                    </p>
                    <p className="text-xs text-[#1a1a1a]/40 mt-0.5 truncate max-w-md">
                      {entry.excerpt}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#1a1a1a]/60 bg-[#f0f0f0] px-2 py-1 rounded">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#1a1a1a]/50">
                      {entry.date}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/cms/${entry.slug}`}
                        className="text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors no-underline border border-[#e5e5e5] px-3 py-1.5 rounded-md hover:bg-[#f5f5f5]"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(entry.slug)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 bg-transparent cursor-pointer"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

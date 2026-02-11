"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CmsArticleForm from "@/components/cms/CmsArticleForm";

export default function CmsEditArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [entry, setEntry] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/journal/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("記事が見つかりません");
        return res.json();
      })
      .then((data) => {
        setEntry(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#1a1a1a]/40">読み込み中...</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-500">{error || "記事が見つかりません"}</p>
      </div>
    );
  }

  return (
    <CmsArticleForm
      mode="edit"
      initialData={
        entry as {
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
      }
    />
  );
}

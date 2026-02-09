import { notFound } from "next/navigation";
import { journalEntries } from "@/data/journal";
import JournalArticleClient from "@/components/JournalArticleClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return journalEntries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = journalEntries.find((e) => e.slug === slug);
  if (!entry) return {};

  return {
    title: `${entry.title} — Hakki Journal`,
    description: entry.excerpt,
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = journalEntries.find((e) => e.slug === slug);
  if (!entry) notFound();

  return <JournalArticleClient entry={entry} />;
}

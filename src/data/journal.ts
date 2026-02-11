import journalData from "./journal.json";

export interface JournalEntry {
  slug: string;
  title: string;
  date: string;
  category: "Design" | "Marketing";
  excerpt: string;
  content: string;
  themeColor: { h: number; s: number; l: number };
  eyecatch?: string;
  eyecatchAlt?: string;
}

export const journalEntries: JournalEntry[] = journalData as JournalEntry[];

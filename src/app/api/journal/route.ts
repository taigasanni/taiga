import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/journal.json");

function readEntries() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeEntries(entries: unknown[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

export async function GET() {
  try {
    const entries = readEntries();
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entries = readEntries();

    // Validate required fields
    if (!body.slug || !body.title || !body.content) {
      return NextResponse.json(
        { error: "slug, title, content are required" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    if (entries.some((e: { slug: string }) => e.slug === body.slug)) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const newEntry = {
      slug: body.slug,
      title: body.title,
      date: body.date || new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      category: body.category || "Marketing",
      excerpt: body.excerpt || "",
      content: body.content,
      themeColor: body.themeColor || { h: 200, s: 20, l: 85 },
      eyecatch: body.eyecatch || "/image.jpg",
      eyecatchAlt: body.eyecatchAlt || body.title,
    };

    entries.unshift(newEntry);
    writeEntries(entries);

    return NextResponse.json(newEntry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

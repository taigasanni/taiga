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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entries = readEntries();
  const entry = entries.find((e: { slug: string }) => e.slug === slug);
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(entry);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const entries = readEntries();
    const index = entries.findIndex((e: { slug: string }) => e.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    entries[index] = { ...entries[index], ...body };
    writeEntries(entries);

    return NextResponse.json(entries[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const entries = readEntries();
    const filtered = entries.filter((e: { slug: string }) => e.slug !== slug);

    if (filtered.length === entries.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    writeEntries(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

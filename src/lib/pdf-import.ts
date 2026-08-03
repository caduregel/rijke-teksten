"use client";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type Line = { text: string; fontSize: number; y: number; page: number };

/** Extracts a best-effort markdown version of a PDF's text (headings/bullets by font size/markers). */
export async function extractMarkdownFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const lines: Line[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    let current: { text: string; y: number; fontSize: number; endX: number } | null = null;
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const str = item.str;
      if (!str.trim()) continue;

      const transform = item.transform as number[];
      const x = transform[4];
      const y = transform[5];
      const fontSize = Math.abs(transform[3]) || 1;
      const width = "width" in item ? (item.width as number) : 0;

      if (current && Math.abs(current.y - y) < fontSize * 0.4) {
        const gap = x - current.endX;
        const needsSpace = gap > fontSize * 0.12 && !/\s$/.test(current.text) && !/^\s/.test(str);
        current.text += (needsSpace ? " " : "") + str;
        current.endX = x + width;
      } else {
        if (current) lines.push({ ...current, page: pageNum });
        current = { text: str, y, fontSize, endX: x + width };
      }
    }
    if (current) lines.push({ ...current, page: pageNum });
  }

  if (lines.length === 0) return "";

  const sortedSizes = lines.map((l) => l.fontSize).sort((a, b) => a - b);
  const mid = Math.floor(sortedSizes.length / 2);
  const bodySize =
    sortedSizes.length % 2 !== 0
      ? sortedSizes[mid]
      : (sortedSizes[mid - 1] + sortedSizes[mid]) / 2;

  // Distinct larger-than-body font sizes, biggest first, map to heading levels 1/2/3.
  const headingSizes = Array.from(
    new Set(
      lines
        .map((l) => Math.round(l.fontSize * 2) / 2)
        .filter((size) => size > bodySize * 1.08)
    )
  ).sort((a, b) => b - a);

  function headingHashes(fontSize: number): string {
    const rounded = Math.round(fontSize * 2) / 2;
    const level = headingSizes.indexOf(rounded);
    return "#".repeat(Math.min(level === -1 ? headingSizes.length - 1 : level, 2) + 1);
  }

  const blocks: string[] = [];
  let prev: Line | null = null;

  for (const line of lines) {
    const text = line.text.replace(/\s+/g, " ").trim();
    if (!text) continue;

    const bulletMatch = text.match(/^[•\-*□✔▪●○◦‣][\s.:]*(.*)$/);
    const numberedMatch = text.match(/^(\d+)[.)]\s*(.*)$/);
    const ratio = line.fontSize / bodySize;
    // Larger font size means a heading, even for numbered ("1. Titel") lines - list-ness loses out.
    const isHeading = !bulletMatch && ratio > 1.08;

    let rendered: string;
    let isPlain = false;
    if (isHeading) {
      rendered = `${headingHashes(line.fontSize)} ${text}`;
    } else if (bulletMatch) {
      rendered = `- ${bulletMatch[1]}`;
    } else if (numberedMatch) {
      rendered = `${numberedMatch[1]}. ${numberedMatch[2]}`;
    } else {
      rendered = text;
      isPlain = true;
    }

    const gap = prev ? prev.y - line.y : Infinity;
    const isWrappedContinuation =
      isPlain &&
      prev !== null &&
      prev.page === line.page &&
      blocks.length > 0 &&
      !blocks[blocks.length - 1].startsWith("#") &&
      !blocks[blocks.length - 1].startsWith("- ") &&
      !/^\d+\.\s/.test(blocks[blocks.length - 1]) &&
      gap < line.fontSize * 1.5;

    if (isWrappedContinuation) {
      blocks[blocks.length - 1] = `${blocks[blocks.length - 1]} ${rendered}`;
    } else {
      blocks.push(rendered);
    }

    prev = line;
  }

  return blocks.join("\n\n");
}


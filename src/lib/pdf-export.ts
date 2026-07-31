import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const PAGE_WIDTH = 595.28; // A4 portrait, points
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const BODY_SIZE = 11;
const LINE_GAP = 6;

function wrapLine(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function renderLessonPdf({
  title,
  group,
  docLabel,
  content,
}: {
  title: string;
  group: string;
  docLabel: string;
  content: string;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${title} - ${docLabel}`);

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const maxWidth = PAGE_WIDTH - MARGIN * 2;

  let page: PDFPage = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function newPage() {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensureSpace(lineHeight: number) {
    if (y - lineHeight < MARGIN) newPage();
  }

  function draw(text: string, font: PDFFont, size: number, gapAfter = LINE_GAP) {
    for (const line of wrapLine(text, font, size, maxWidth)) {
      const lineHeight = size + 4;
      ensureSpace(lineHeight);
      page.drawText(line, { x: MARGIN, y, size, font, color: rgb(0.12, 0.12, 0.15) });
      y -= lineHeight;
    }
    y -= gapAfter;
  }

  draw(title, bold, 18, 2);
  draw(`${group} · ${docLabel}`, regular, 10, 16);

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      y -= LINE_GAP;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const bullet = line.match(/^[-*□✔]\s+(.*)$/);

    if (heading) {
      const size = heading[1].length === 1 ? 15 : heading[1].length === 2 ? 13 : 12;
      draw(heading[2], bold, size, 8);
    } else if (bullet) {
      draw(`•  ${bullet[1]}`, regular, BODY_SIZE);
    } else {
      draw(line.replace(/\*\*(.*?)\*\*/g, "$1"), regular, BODY_SIZE);
    }
  }

  return pdf.save();
}

import { NextResponse } from "next/server";
import { getTekstBySlug } from "@/server/lessons";
import { getCurrentUser } from "@/lib/session";
import { canAccessLesson } from "@/lib/access";
import { renderLessonPdf } from "@/lib/pdf-export";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const docKey = searchParams.get("doc") ?? "tekst";

  const [tekst, user] = await Promise.all([getTekstBySlug(slug), getCurrentUser()]);

  if (!tekst) {
    return NextResponse.json({ error: "Tekst niet gevonden" }, { status: 404 });
  }

  if (!canAccessLesson(tekst, user)) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  let docLabel: string;
  let content: string;

  if (docKey === "tekst") {
    docLabel = "Tekst";
    content = tekst.textContent;
  } else if (docKey === "tekstanalyse") {
    docLabel = "Tekstanalyse";
    content = tekst.textAnalysisContent;
  } else {
    const lessonId = Number(docKey.replace(/^les-/, ""));
    const lesson = tekst.lessons.find((item) => item.id === lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Onbekend document" }, { status: 400 });
    }
    docLabel = lesson.title;
    content = lesson.content;
  }

  const pdfBytes = await renderLessonPdf({
    title: tekst.title,
    group: tekst.group,
    docLabel,
    content,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${tekst.slug}-${docKey}.pdf"`,
    },
  });
}

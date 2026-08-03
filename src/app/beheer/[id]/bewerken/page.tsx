import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getTekstById } from "@/server/lessons";
import { LessonForm } from "@/components/admin/lesson-form";

export default async function BewerkTekstPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/inloggen");
  }
  if (user.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;
  const tekst = await getTekstById(Number(id));
  if (!tekst) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Tekst bewerken</h1>
      <LessonForm
        mode="edit"
        tekstId={tekst.id}
        initialForm={{
          title: tekst.title,
          slug: tekst.slug,
          group: tekst.group,
          genre: tekst.genre,
          theme: tekst.theme ?? "",
          imageUrl: tekst.imageUrl ?? "",
          textContent: tekst.textContent,
          textAnalysisContent: tekst.textAnalysisContent,
          isFree: tekst.isFree,
        }}
        initialLessons={tekst.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          content: lesson.content,
        }))}
      />
    </section>
  );
}

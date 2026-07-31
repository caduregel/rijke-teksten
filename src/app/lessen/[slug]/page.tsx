import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getTekstBySlug } from "@/server/lessons";
import { getCurrentUser } from "@/lib/session";
import { canAccessLesson } from "@/lib/access";
import { LessonViewer } from "@/components/lesson-viewer";
import { LessonLockedNotice } from "@/components/lesson-locked-notice";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [lesson, user] = await Promise.all([getTekstBySlug(slug), getCurrentUser()]);

  if (!lesson) {
    notFound();
  }

  const unlocked = canAccessLesson(lesson, user);

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <LessonLockedNotice title={lesson.title} />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex flex-wrap gap-1.5">
        <Badge variant="secondary">{lesson.group}</Badge>
        <Badge variant="secondary">{lesson.genre}</Badge>
        {lesson.theme && <Badge variant="secondary">{lesson.theme}</Badge>}
      </div>

      <LessonViewer
        slug={lesson.slug}
        title={lesson.title}
        group={lesson.group}
        imageUrl={lesson.imageUrl}
        textContent={lesson.textContent}
        textAnalysisContent={lesson.textAnalysisContent}
        lessons={lesson.lessons}
      />
    </section>
  );
}

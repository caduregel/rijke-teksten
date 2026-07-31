import { canAccessLesson } from "@/lib/access";
import { LessonCard, type LessonCardData } from "@/components/lesson-card";

export function LessonGrid({
  lessons,
  user,
}: {
  lessons: LessonCardData[];
  user: { role?: string } | null;
}) {
  if (lessons.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Geen lessen gevonden.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.slug}
          lesson={lesson}
          locked={!canAccessLesson(lesson, user)}
        />
      ))}
    </div>
  );
}

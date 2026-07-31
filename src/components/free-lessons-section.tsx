import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LessonCardData } from "@/components/lesson-card";

export function FreeLessonsSection({ lessons }: { lessons: LessonCardData[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          {lessons.length} gratis teksten
        </h2>
        <Button render={<Link href="/lessen" />} variant="ghost" size="sm">
          Alle lessen
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {lessons.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/lessen/${lesson.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-4/3 w-full bg-muted">
              {lesson.imageUrl ? (
                <Image
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 20vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="size-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <span className="text-xs text-muted-foreground">{lesson.group}</span>
              <h3 className="font-medium leading-snug">{lesson.title}</h3>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
                Bekijk les
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { getAllTeksten } from "@/server/lessons";
import { getCurrentUser } from "@/lib/session";
import { LessonFilters } from "@/components/lesson-filters";
import { LessonSort } from "@/components/lesson-sort";
import { LessonGrid } from "@/components/lesson-grid";
import { SubscribeCta } from "@/components/subscribe-cta";

export default async function LessenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; groep?: string; thema?: string; genre?: string; sort?: string }>;
}) {
  const { q, groep, thema, genre, sort } = await searchParams;
  const [lessons, user] = await Promise.all([getAllTeksten(), getCurrentUser()]);

  const query = q?.toLowerCase().trim();
  let filtered = lessons.filter((lesson) => {
    if (groep && lesson.group !== groep) return false;
    if (thema && lesson.theme !== thema) return false;
    if (genre && lesson.genre !== genre) return false;
    if (query) {
      const haystack = [lesson.title, lesson.group, lesson.genre, lesson.theme]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "oudste") return a.createdAt.getTime() - b.createdAt.getTime();
    if (sort === "titel") return a.title.localeCompare(b.title);
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const groups = [...new Set(lessons.map((lesson) => lesson.group))].sort();
  const genres = [...new Set(lessons.map((lesson) => lesson.genre))].sort();
  const themes = [...new Set(lessons.map((lesson) => lesson.theme).filter(Boolean))] as string[];

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Alle rijke teksten</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kies een tekst en geef betekenisvol leesonderwijs.
        </p>

        <div className="mt-6">
          <LessonFilters groups={groups} genres={genres} themes={themes.sort()} />
        </div>

        <div className="mt-8 mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Alle teksten ({filtered.length})
          </h2>
          <LessonSort />
        </div>

        <LessonGrid lessons={filtered} user={user} />
      </section>
      <SubscribeCta />
    </>
  );
}

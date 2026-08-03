import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllTeksten } from "@/server/lessons";
import { getCurrentUser } from "@/lib/session";
import { LessonTable } from "@/components/admin/lesson-table";

export default async function BeheerPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/inloggen");
  }
  if (user.role !== "admin") {
    redirect("/");
  }

  const lessons = await getAllTeksten();

  return (
    <section className="mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Beheer</h1>
        <Button render={<Link href="/beheer/nieuw" />}>
          <Plus data-icon="inline-start" />
          Nieuwe tekst
        </Button>
      </div>
      <LessonTable lessons={lessons} />
    </section>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LessonForm } from "@/components/admin/lesson-form";

export default async function NieuweTekstPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/inloggen");
  }
  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Nieuwe tekst toevoegen</h1>
      <LessonForm />
    </section>
  );
}

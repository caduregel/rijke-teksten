"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { auth } from "@/lib/auth";

export type LessonInput = {
  title: string;
  slug: string;
  group: string;
  genre: string;
  theme?: string;
  imageUrl?: string;
  textContent: string;
  textAnalysisContent: string;
  lessonContent: string;
  isFree: boolean;
};

// TODO: replace with a real admin check once the beheeromgeving has roles beyond free/subscriber.
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function getAllLessons() {
  return db.select().from(lessons).orderBy(asc(lessons.createdAt));
}

export async function getFreeLessons(limit = 5) {
  return db
    .select()
    .from(lessons)
    .where(eq(lessons.isFree, true))
    .orderBy(asc(lessons.createdAt))
    .limit(limit);
}

export async function getLessonBySlug(slug: string) {
  const [lesson] = await db.select().from(lessons).where(eq(lessons.slug, slug)).limit(1);
  return lesson;
}

export async function createLesson(input: LessonInput) {
  await requireAdmin();
  const [created] = await db.insert(lessons).values(input).returning();
  revalidatePath("/lessen");
  return created;
}

export async function updateLesson(id: number, input: Partial<LessonInput>) {
  await requireAdmin();
  const [updated] = await db
    .update(lessons)
    .set(input)
    .where(eq(lessons.id, id))
    .returning();
  revalidatePath("/lessen");
  return updated;
}

export async function deleteLesson(id: number) {
  await requireAdmin();
  await db.delete(lessons).where(eq(lessons.id, id));
  revalidatePath("/lessen");
}

"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { teksten, lessen } from "@/db/schema";
import { auth } from "@/lib/auth";

export type TekstInput = {
    title: string;
    slug: string;
    group: string;
    genre: string;
    theme?: string;
    imageUrl?: string;
    textContent: string;
    textAnalysisContent: string;
    isFree: boolean;
};

export type LessonInput = {
    tekstId: number;
    title: string;
    content: string;
    order?: number;
};

// Only admins may create/update/delete teksten and lessen.
async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Not authenticated");
    if (session.user.role !== "admin") throw new Error("Insufficient permissions");
    return session;
}

export async function getAllTeksten() {
    return db.select().from(teksten).orderBy(asc(teksten.createdAt));
}

export async function getFreeTeksten(limit = 5) {
    return db
        .select()
        .from(teksten)
        .where(eq(teksten.isFree, true))
        .orderBy(asc(teksten.createdAt))
        .limit(limit);
}

export async function getTekstBySlug(slug: string) {
    const [tekst] = await db.select().from(teksten).where(eq(teksten.slug, slug)).limit(1);
    if (!tekst) return undefined;

    const lessons = await db
        .select()
        .from(lessen)
        .where(eq(lessen.tekstId, tekst.id))
        .orderBy(asc(lessen.order), asc(lessen.createdAt));

    return { ...tekst, lessons };
}

export async function createTekst(input: TekstInput) {
    await requireAdmin();
    const [created] = await db.insert(teksten).values(input).returning();
    revalidatePath("/lessen");
    return created;
}

export async function updateTekst(id: number, input: Partial<TekstInput>) {
    await requireAdmin();
    const [updated] = await db
        .update(teksten)
        .set(input)
        .where(eq(teksten.id, id))
        .returning();
    revalidatePath("/lessen");
    return updated;
}

export async function deleteTekst(id: number) {
    await requireAdmin();
    // Lessen for this tekst are removed automatically via the "on delete cascade" foreign key.
    await db.delete(teksten).where(eq(teksten.id, id));
    revalidatePath("/lessen");
}

export async function createLesson(input: LessonInput) {
    await requireAdmin();
    const [created] = await db.insert(lessen).values(input).returning();
    revalidatePath("/lessen");
    return created;
}

export async function updateLesson(id: number, input: Partial<LessonInput>) {
    await requireAdmin();
    const [updated] = await db
        .update(lessen)
        .set(input)
        .where(eq(lessen.id, id))
        .returning();
    revalidatePath("/lessen");
    return updated;
}

export async function deleteLesson(id: number) {
    await requireAdmin();
    await db.delete(lessen).where(eq(lessen.id, id));
    revalidatePath("/lessen");
}


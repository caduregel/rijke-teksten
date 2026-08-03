"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PdfImportButton } from "@/components/admin/pdf-import-button";
import {
  createTekst,
  updateTekst,
  createLesson,
  updateLesson,
  deleteLesson,
  type TekstInput,
} from "@/server/lessons";

const emptyForm: TekstInput = {
  title: "",
  slug: "",
  group: "",
  genre: "",
  theme: "",
  imageUrl: "",
  textContent: "",
  textAnalysisContent: "",
  isFree: false,
};

type LessonDraft = { id?: number; title: string; content: string };

const emptyLessonDraft: LessonDraft = { title: "", content: "" };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type LessonFormProps = {
  mode?: "create" | "edit";
  tekstId?: number;
  initialForm?: TekstInput;
  initialLessons?: LessonDraft[];
};

export function LessonForm({
  mode = "create",
  tekstId,
  initialForm,
  initialLessons,
}: LessonFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<TekstInput>(initialForm ?? emptyForm);
  const [lessonDrafts, setLessonDrafts] = useState<LessonDraft[]>(
    initialLessons && initialLessons.length > 0 ? initialLessons : [emptyLessonDraft]
  );
  const [originalLessonIds] = useState<number[]>(
    (initialLessons ?? []).flatMap((draft) => (draft.id ? [draft.id] : []))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof TekstInput>(key: K, value: TekstInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateLessonDraft(index: number, key: keyof LessonDraft, value: string) {
    setLessonDrafts((prev) =>
      prev.map((draft, i) => (i === index ? { ...draft, [key]: value } : draft))
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          const drafts = lessonDrafts.filter(
            (draft) => draft.title.trim() || draft.content.trim()
          );

          if (mode === "edit" && tekstId) {
            await updateTekst(tekstId, { ...form, slug: form.slug || slugify(form.title) });

            const keptIds = drafts.flatMap((draft) => (draft.id ? [draft.id] : []));
            const removedIds = originalLessonIds.filter((id) => !keptIds.includes(id));
            for (const id of removedIds) {
              await deleteLesson(id);
            }
            for (const [index, draft] of drafts.entries()) {
              if (draft.id) {
                await updateLesson(draft.id, {
                  title: draft.title || `Les ${index + 1}`,
                  content: draft.content,
                  order: index,
                });
              } else {
                await createLesson({
                  tekstId,
                  title: draft.title || `Les ${index + 1}`,
                  content: draft.content,
                  order: index,
                });
              }
            }
          } else {
            const tekst = await createTekst({ ...form, slug: form.slug || slugify(form.title) });
            for (const [index, draft] of drafts.entries()) {
              await createLesson({
                tekstId: tekst.id,
                title: draft.title || `Les ${index + 1}`,
                content: draft.content,
                order: index,
              });
            }
          }
          router.push("/beheer");
          router.refresh();
        } catch {
          setError("Opslaan is niet gelukt. Controleer de velden en probeer opnieuw.");
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug (optioneel)</Label>
          <Input
            id="slug"
            placeholder="automatisch op basis van titel"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="group">Groep</Label>
          <Input
            id="group"
            required
            placeholder="Groep 5"
            value={form.group}
            onChange={(e) => update("group", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="genre">Genre</Label>
          <Input
            id="genre"
            required
            value={form.genre}
            onChange={(e) => update("genre", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="theme">Thema</Label>
          <Input
            id="theme"
            value={form.theme}
            onChange={(e) => update("theme", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="imageUrl">Afbeelding (URL)</Label>
          <Input
            id="imageUrl"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="textContent">Tekst</Label>
        </div>
        <Textarea
          id="textContent"
          rows={6}
          value={form.textContent}
          onChange={(e) => update("textContent", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="textAnalysisContent">Tekstanalyse</Label>
          <PdfImportButton
            onImport={(markdown) => update("textAnalysisContent", markdown)}
          />
        </div>
        <Textarea
          id="textAnalysisContent"
          rows={6}
          value={form.textAnalysisContent}
          onChange={(e) => update("textAnalysisContent", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Lessen bij deze tekst</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLessonDrafts((prev) => [...prev, emptyLessonDraft])}
          >
            <Plus data-icon="inline-start" />
            Les toevoegen
          </Button>
        </div>
        {lessonDrafts.map((draft, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <Input
                placeholder={`Les ${index + 1} titel (bijv. 3V-leesroutine)`}
                value={draft.title}
                onChange={(e) => updateLessonDraft(index, "title", e.target.value)}
              />
              {lessonDrafts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setLessonDrafts((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 data-icon="inline-start" />
                </Button>
              )}
            </div>
            <div className="flex justify-end">
              <PdfImportButton
                onImport={(markdown) => updateLessonDraft(index, "content", markdown)}
              />
            </div>
            <Textarea
              rows={5}
              placeholder="Inhoud van de les"
              value={draft.content}
              onChange={(e) => updateLessonDraft(index, "content", e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isFree"
          checked={form.isFree}
          onCheckedChange={(checked) => update("isFree", checked === true)}
        />
        <Label htmlFor="isFree">Gratis tekst?</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting
          ? "Bezig met opslaan..."
          : mode === "edit"
            ? "Wijzigingen opslaan"
            : "Tekst toevoegen"}
      </Button>
    </form>
  );
}

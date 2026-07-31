"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createTekst, createLesson, type TekstInput } from "@/server/lessons";

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

type LessonDraft = { title: string; content: string };

const emptyLessonDraft: LessonDraft = { title: "", content: "" };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LessonForm() {
  const router = useRouter();
  const [form, setForm] = useState<TekstInput>(emptyForm);
  const [lessonDrafts, setLessonDrafts] = useState<LessonDraft[]>([emptyLessonDraft]);
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
          const tekst = await createTekst({ ...form, slug: form.slug || slugify(form.title) });
          const drafts = lessonDrafts.filter(
            (draft) => draft.title.trim() || draft.content.trim()
          );
          for (const [index, draft] of drafts.entries()) {
            await createLesson({
              tekstId: tekst.id,
              title: draft.title || `Les ${index + 1}`,
              content: draft.content,
              order: index,
            });
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
        <Label htmlFor="textContent">Tekst</Label>
        <Textarea
          id="textContent"
          rows={6}
          value={form.textContent}
          onChange={(e) => update("textContent", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="textAnalysisContent">Tekstanalyse</Label>
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
        {submitting ? "Bezig met opslaan..." : "Tekst toevoegen"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, Download, FileText, NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownContent } from "@/components/markdown-content";
import { cn } from "@/lib/utils";

type Doc = {
  key: string;
  label: string;
  icon: typeof FileText;
  content: string;
};

export function LessonViewer({
  title,
  group,
  imageUrl,
  slug,
  textContent,
  textAnalysisContent,
  lessons,
}: {
  title: string;
  group: string;
  imageUrl: string | null;
  slug: string;
  textContent: string;
  textAnalysisContent: string;
  lessons: { id: number; title: string; content: string }[];
}) {
  const docs: Doc[] = [
    { key: "tekst", label: "Tekst", icon: BookOpen, content: textContent },
    { key: "tekstanalyse", label: "Tekstanalyse", icon: FileText, content: textAnalysisContent },
    ...lessons.map((lesson) => ({
      key: `les-${lesson.id}`,
      label: lesson.title,
      icon: NotebookText,
      content: lesson.content,
    })),
  ];
  const [activeKey, setActiveKey] = useState(docs[0].key);
  const active = docs.find((doc) => doc.key === activeKey) ?? docs[0];

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-4">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <h1 className="font-medium leading-snug">{title}</h1>
          <p className="text-sm text-muted-foreground">{group}</p>
        </div>
        <nav className="flex flex-col gap-1">
          {docs.map((doc) => (
            <button
              key={doc.key}
              type="button"
              onClick={() => setActiveKey(doc.key)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                doc.key === activeKey
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <doc.icon className="size-4" />
              {doc.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{active.label}</p>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          </div>
          <Button render={<a href={`/api/lessen/${slug}/export?doc=${active.key}`} />}>
            <Download data-icon="inline-start" />
            Downloaden als PDF
          </Button>
        </div>

        <Card>
          <CardContent>
            {active.content ? (
              <MarkdownContent content={active.content} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Voor deze tekst is nog geen inhoud toegevoegd.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

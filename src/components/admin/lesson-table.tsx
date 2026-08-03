"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTekst } from "@/server/lessons";

export type AdminLesson = {
  id: number;
  slug: string;
  title: string;
  group: string;
  genre: string;
  isFree: boolean;
};

export function LessonTable({ lessons }: { lessons: AdminLesson[] }) {
  const [items, setItems] = useState(lessons);
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Nog geen teksten toegevoegd.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titel</TableHead>
          <TableHead>Groep</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>Toegang</TableHead>
          <TableHead className="text-right">Actie</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((lesson) => (
          <TableRow key={lesson.id}>
            <TableCell className="font-medium">
              <Link href={`/lessen/${lesson.slug}`} className="hover:underline">
                {lesson.title}
              </Link>
            </TableCell>
            <TableCell>{lesson.group}</TableCell>
            <TableCell>{lesson.genre}</TableCell>
            <TableCell>
              <Badge variant={lesson.isFree ? "default" : "outline"}>
                {lesson.isFree ? "Gratis" : "Abonnement"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/beheer/${lesson.id}/bewerken`} />}
                >
                  <Pencil data-icon="inline-start" />
                  Bewerken
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await deleteTekst(lesson.id);
                      setItems((prev) => prev.filter((item) => item.id !== lesson.id));
                    })
                  }
                >
                  <Trash2 data-icon="inline-start" />
                  Verwijderen
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type LessonCardData = {
  slug: string;
  title: string;
  group: string;
  genre: string;
  imageUrl: string | null;
  isFree: boolean;
};

export function LessonCard({ lesson, locked }: { lesson: LessonCardData; locked: boolean }) {
  const body = (
    <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
      <div className="relative aspect-4/3 w-full bg-muted">
        {lesson.imageUrl ? (
          <Image
            src={lesson.imageUrl}
            alt={lesson.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="size-8 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute top-2 left-2" variant="secondary">
          {lesson.genre}
        </Badge>
        {locked && (
          <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
            <Lock className="size-3.5" />
          </span>
        )}
      </div>
      <CardContent className="flex flex-col gap-1 pt-4">
        <span className="text-xs text-muted-foreground">{lesson.group}</span>
        <h3 className="text-base font-medium leading-snug">{lesson.title}</h3>
      </CardContent>
      <CardFooter className="pt-0">
        {lesson.isFree ? (
          <Badge className="bg-emerald-500/10 text-emerald-700" variant="secondary">
            Gratis
          </Badge>
        ) : (
          <Badge variant="outline">
            <Lock data-icon="inline-start" />
            Alleen voor abonnees
          </Badge>
        )}
      </CardFooter>
    </Card>
  );

  if (!locked) {
    return (
      <Link href={`/lessen/${lesson.slug}`} className="block">
        {body}
      </Link>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="block w-full text-left">{body}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abonnement nodig</DialogTitle>
          <DialogDescription>
            &ldquo;{lesson.title}&rdquo; is onderdeel van het betaalde aanbod. Sluit een
            abonnement af om deze en alle andere lessen te ontgrendelen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button render={<Link href="/abonnement" />}>Bekijk abonnementen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

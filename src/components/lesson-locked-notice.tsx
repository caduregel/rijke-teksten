import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LessonLockedNotice({ title }: { title: string }) {
  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardHeader className="items-center">
        <Lock className="size-8 text-muted-foreground" />
        <CardTitle>Abonnement nodig</CardTitle>
        <CardDescription>
          &ldquo;{title}&rdquo; is onderdeel van het betaalde aanbod. Sluit een abonnement af
          om de tekst, tekstanalyse en les te bekijken en te downloaden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button render={<Link href="/abonnement" />}>Bekijk abonnementen</Button>
      </CardContent>
    </Card>
  );
}

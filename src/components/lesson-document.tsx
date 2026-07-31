"use client";

import { useState } from "react";
import { Download, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LessonDocument({
  label,
  content,
  downloadHref,
}: {
  label: string;
  content: string;
  downloadHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{label}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? <EyeOff data-icon="inline-start" /> : <Eye data-icon="inline-start" />}
            {open ? "Verberg" : "Bekijk"}
          </Button>
          <Button render={<a href={downloadHref} />} size="sm">
            <Download data-icon="inline-start" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          {content ? (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
              {content}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Voor deze tekst is nog geen inhoud toegevoegd.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

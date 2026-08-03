"use client";

import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractMarkdownFromPdf } from "@/lib/pdf-import";

type PdfImportButtonProps = {
  onImport: (markdown: string) => void;
  label?: string;
};

export function PdfImportButton({
  onImport,
  label = "Vul in vanuit PDF",
}: PdfImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        <FileUp data-icon="inline-start" />
        {loading ? "Bezig met verwerken..." : label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setLoading(true);
          setError(null);
          try {
            const markdown = await extractMarkdownFromPdf(file);
            onImport(markdown);
          } catch {
            setError("PDF kon niet worden verwerkt.");
          } finally {
            setLoading(false);
          }
        }}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}


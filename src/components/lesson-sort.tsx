"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { value: "nieuwste", label: "Nieuwste" },
  { value: "oudste", label: "Oudste" },
  { value: "titel", label: "Titel (A-Z)" },
];

export function LessonSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "nieuwste";

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden sm:inline">Sorteren op:</span>
      <Select
        value={sort}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams.toString());
          if (value === "nieuwste") {
            params.delete("sort");
          } else {
            params.set("sort", String(value));
          }
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

export function LessonFilters({
  groups,
  genres,
  themes,
}: {
  groups: string[];
  genres: string[];
  themes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = ["q", "groep", "genre", "thema"].some((key) => searchParams.get(key));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <form
        className="flex flex-1 items-center gap-2 sm:min-w-64"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          updateParam("q", String(formData.get("q") ?? "").trim());
        }}
      >
        <Input
          name="q"
          type="search"
          placeholder="Zoek op onderwerp, titel, thema of groep..."
          defaultValue={searchParams.get("q") ?? ""}
          className="bg-background"
        />
        <Button type="submit" size="icon" variant="outline" aria-label="Zoeken">
          <Search />
        </Button>
      </form>

      <Select
        value={searchParams.get("groep") ?? ALL}
        onValueChange={(value) => updateParam("groep", String(value))}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Groep" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Alle groepen</SelectItem>
          {groups.map((group) => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("thema") ?? ALL}
        onValueChange={(value) => updateParam("thema", String(value))}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Thema" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Alle thema&apos;s</SelectItem>
          {themes.map((theme) => (
            <SelectItem key={theme} value={theme}>
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("genre") ?? ALL}
        onValueChange={(value) => updateParam("genre", String(value))}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Alle genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
          <X data-icon="inline-start" />
          Wis filters
        </Button>
      )}
    </div>
  );
}

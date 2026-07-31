"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();

  return (
    <form
      className="flex w-full max-w-md items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const q = String(formData.get("q") ?? "").trim();
        router.push(q ? `/lessen?q=${encodeURIComponent(q)}` : "/lessen");
      }}
    >
      <Input
        name="q"
        type="search"
        placeholder="Zoek op onderwerp, titel, thema of groep..."
        defaultValue={defaultValue}
        className="bg-background"
      />
      <Button type="submit" size="icon" aria-label="Zoeken">
        <Search />
      </Button>
    </form>
  );
}

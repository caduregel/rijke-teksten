import Link from "next/link";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="relative flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkle className="size-4" fill="currentColor" />
      </span>
      Rijke Teksten
    </Link>
  );
}

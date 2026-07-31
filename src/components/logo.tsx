import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 font-heading text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <Image alt="logo" src="/LR.svg" width={30} height={30} />
      <div>
        <span>Lees </span>
        <span className="text-primary">Routine</span>
      </div>
    </Link>
  );
}

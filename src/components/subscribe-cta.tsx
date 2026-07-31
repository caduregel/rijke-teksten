import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubscribeCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary/10 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Lock className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">Wil je toegang tot alle teksten?</h2>
            <p className="text-sm text-muted-foreground">
              Abonneer je en krijg direct toegang tot alle rijke teksten, elke week nieuwe
              lessen en meer.
            </p>
          </div>
        </div>
        <Button render={<Link href="/abonnement" />} className="shrink-0">
          Bekijk abonnementen
        </Button>
      </div>
    </section>
  );
}

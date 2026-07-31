"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <div className="h-9 w-20 animate-pulse rounded-full bg-muted" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button render={<Link href="/inloggen" />} variant="ghost" size="sm">
          Inloggen
        </Button>
        <Button render={<Link href="/abonnement" />} size="sm">
          Abonneren
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {session.user.email}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
          router.refresh();
        }}
      >
        <LogOut data-icon="inline-start" />
        Uitloggen
      </Button>
    </div>
  );
}

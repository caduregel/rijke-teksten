"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function MagicLinkForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm flex flex-col gap-2 text-center">
        <p>Check je inbox! We hebben een inloglink gestuurd.</p>
        <p className="text-xs text-muted-foreground">
          Geen e-mail ontvangen? Controleer je spamfolder, of probeer het
          opnieuw.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("sending");
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const { error } = await authClient.signIn.magicLink({
          email,
          callbackURL: "/",
        });
        setStatus(error ? "error" : "sent");
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mailadres</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="jij@school.nl"
          required
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive">
          Er ging iets mis bij het versturen. Probeer het opnieuw.
        </p>
      )}
      <Button type="submit" disabled={status === "sending"}>
        <Mail data-icon="inline-start" />
        {status === "sending" ? "Bezig met versturen..." : "Stuur inloglink"}
      </Button>
    </form>
  );
}

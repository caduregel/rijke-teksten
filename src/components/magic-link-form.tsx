"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const RESEND_COOLDOWN_SECONDS = 60;

export function MagicLinkForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm flex flex-col gap-2 text-center">
        <p>Check je inbox! We hebben een inloglink gestuurd.</p>
        <p className="text-xs text-muted-foreground">
          Geen e-mail ontvangen? Controleer je spamfolder, of probeer het
          opnieuw.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={cooldown > 0}
          onClick={() => {
            setStatus("idle");
            setErrorMessage(null);
          }}
        >
          {cooldown > 0 ? `Opnieuw versturen kan over ${cooldown}s` : "Opnieuw versturen"}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("sending");
        setErrorMessage(null);
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const { error } = await authClient.signIn.magicLink({
          email,
          callbackURL: "/",
          fetchOptions: {
            onError: ({ response }) => {
              if (response.status === 429) {
                const retryAfter = Number(response.headers.get("X-Retry-After") ?? RESEND_COOLDOWN_SECONDS);
                setCooldown(retryAfter);
                setErrorMessage(
                  `Je hebt al een aantal keer een inloglink aangevraagd. Probeer het over ${retryAfter} seconden opnieuw.`,
                );
              }
            },
          },
        });
        if (!error) {
          setCooldown(RESEND_COOLDOWN_SECONDS);
        }
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
          {errorMessage ?? "Er ging iets mis bij het versturen. Probeer het opnieuw."}
        </p>
      )}
      <Button type="submit" disabled={status === "sending" || cooldown > 0}>
        <Mail data-icon="inline-start" />
        {status === "sending"
          ? "Bezig met versturen..."
          : cooldown > 0
            ? `Probeer over ${cooldown}s opnieuw`
            : "Stuur inloglink"}
      </Button>
    </form>
  );
}

import { MagicLinkForm } from "@/components/magic-link-form";

export default function InloggenPage() {
  return (
    <section className="mx-auto flex max-w-sm flex-1 flex-col justify-center px-6 py-20">
      <h1 className="text-2xl font-semibold tracking-tight">Inloggen</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">
        Geen wachtwoord nodig: we sturen je een inloglink per e-mail.
      </p>
      <MagicLinkForm />
    </section>
  );
}

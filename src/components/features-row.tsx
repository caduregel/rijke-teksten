import { Smartphone, ShieldCheck, Users } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Direct inzetbaar",
    description: "Geen voorbereiding nodig. Gewoon downloaden en gaan.",
  },
  {
    icon: ShieldCheck,
    title: "Gebaseerd op de 3V-leesroutine",
    description: "Verwonderen, Verdiepen, Verrijken: een bewezen aanpak.",
  },
  {
    icon: Users,
    title: "Voor elke groep",
    description: "Geschikt voor groep 5 t/m 8 van het basisonderwijs.",
  },
];

export function FeaturesRow() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4.5" />
            </span>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

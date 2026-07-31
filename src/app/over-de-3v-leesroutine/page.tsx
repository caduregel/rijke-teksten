import { Sparkles, Search, Target, TrendingUp, Users, Heart, Lock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    iconClassName: "bg-amber-500/10 text-amber-600",
    title: "Verwonderen",
    duration: "15 min.",
    durationClassName: "bg-amber-500/10 text-amber-700",
    description: "Leerlingen maken kennis met de tekst en stellen vragen.",
    bullets: ["Voorspellen op basis van titel en afbeelding", "Eerste indrukken en vragen opschrijven"],
    goal: "Nieuwsgierigheid opwekken en een eerste verbinding maken met de tekst.",
  },
  {
    icon: Target,
    iconClassName: "bg-primary/10 text-primary",
    title: "Verdiepen",
    duration: "20 min.",
    durationClassName: "bg-primary/10 text-primary",
    description: "Leerlingen lezen en onderzoeken de tekst grondig.",
    bullets: ["Tekst lezen met aandacht", "Belangrijke woorden en zinnen opzoeken"],
    goal: "De inhoud en betekenis van de tekst goed begrijpen.",
  },
  {
    icon: Sparkles,
    iconClassName: "bg-emerald-500/10 text-emerald-600",
    title: "Verrijken",
    duration: "15 min.",
    durationClassName: "bg-emerald-500/10 text-emerald-700",
    description: "Leerlingen verbinden de tekst met zichzelf en de wereld.",
    bullets: ["Betekenis en boodschap bespreken", "Eigen mening vormen en creatief verwerken"],
    goal: "De tekst betekenis geven en verbinden met de eigen leefwereld.",
  },
];

const strengths = [
  { icon: Users, title: "Voor alle leerlingen", description: "Geschikt voor groep 5 t/m 8 van het basisonderwijs." },
  { icon: Target, title: "Duidelijke structuur", description: "Vaste opbouw zorgt voor rust, herkenning en diepgang." },
  { icon: TrendingUp, title: "Onderzoek onderbouwd", description: "Gebaseerd op bewezen inzichten over begrijpend lezen." },
  { icon: Heart, title: "Betekenisvol leren", description: "Leerlingen worden actieve lezers met een eigen stem." },
];

export default function OverDe3VLeesroutinePage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">De 3V-leesroutine</h1>
        <p className="mt-2 text-lg font-medium text-primary">Diepe leeslessen in drie stappen.</p>
        <p className="mt-4 text-muted-foreground">
          De 3V-leesroutine is een krachtige, onderzoek onderbouwde manier om met rijke teksten
          te werken in de klas. Leerlingen worden actief betrokken bij de tekst en ontwikkelen
          stap voor stap een diep tekstbegrip en eigen mening.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="text-xl font-semibold tracking-tight">De 3 stappen</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elke les volgt dezelfde duidelijke structuur. Zo weten leerlingen wat ze kunnen
          verwachten en kunnen ze zich volledig richten op de tekst.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full ${step.iconClassName}`}
                >
                  <step.icon className="size-5" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium">
                      {index + 1}. {step.title}
                    </h3>
                    <Badge className={step.durationClassName} variant="secondary">
                      {step.duration}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {step.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground sm:max-w-56">
                  <span className="font-medium text-foreground">Doel:</span> {step.goal}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-3xl bg-primary/10 p-8">
          <h2 className="font-semibold">De kracht van de 3V-leesroutine</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-2">
                <Icon className="size-5 text-primary" />
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pt-4 pb-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-amber-500/10 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700">
              <Lock className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Klaar om de 3V-leesroutine toe te passen?</h2>
              <p className="text-sm text-muted-foreground">
                Bekijk onze rijke teksten en complete lessenseries, helemaal volgens de
                3V-leesroutine.
              </p>
            </div>
          </div>
          <Button render={<Link href="/lessen" />} className="shrink-0 bg-amber-600 hover:bg-amber-600/90">
            Bekijk alle teksten
          </Button>
        </div>
      </section>
    </>
  );
}

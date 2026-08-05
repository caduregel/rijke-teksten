import Link from "next/link";
import { Check, BookOpen, Smartphone, CloudDownload, Heart, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    icon: BookOpen,
    title: "Alle Lees Routine Teksten",
    description: "Onbeperkt toegang tot alle teksten, analyses en lessen.",
  },
  {
    icon: Smartphone,
    title: "Direct inzetbaar",
    description: "Download de lessen als PDF en gebruik ze direct in de klas.",
  },
  {
    icon: CloudDownload,
    title: "Nieuwe lessen",
    description: "Elke maand nieuwe lessen en teksten toegevoegd.",
  },
  {
    icon: Heart,
    title: "Ontwikkeld door leerkrachten",
    description: "Met liefde gemaakt voor het basisonderwijs.",
  },
];

const plans = [
  {
    name: "Individueel",
    tagline: "Voor persoonlijk gebruik door één leerkracht",
    highlighted: false,
    benefits: [
      "Onbeperkt toegang tot alle teksten en lessen",
      "Nieuwe lessen elke maand",
      "Download als PDF",
      "Voor gebruik door één persoon",
    ],
  },
  {
    name: "School",
    tagline: "Voor het hele team, schoolbreed toegankelijk",
    highlighted: true,
    benefits: [
      "Onbeperkt toegang tot alle teksten en lessen",
      "Nieuwe lessen elke maand",
      "Download als PDF",
      "Toegang voor het hele schoolteam",
    ],
  },
];

const faqs = [
  {
    question: "Kan ik het abonnement op elk moment opzeggen?",
    answer: "Ja, je kunt je abonnement altijd opzeggen. Er zitten geen kleine lettertjes aan vast.",
  },
  {
    question: "Hoe werkt het na mijn aanmelding?",
    answer: "Direct na je aanmelding krijg je toegang tot alle rijke teksten en lessenseries.",
  },
  {
    question: "Kan ik een factuur krijgen voor mijn school?",
    answer: "Ja, na het afronden van je abonnement ontvang je automatisch een factuur per e-mail.",
  },
  {
    question: "Welke betaalmethoden zijn er?",
    answer: "Je kunt veilig betalen met iDEAL, creditcard en meer.",
  },
];

export default function AbonnementPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-8 text-center">
        <Badge className="mb-4">Bèta</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Krijg toegang tot alle rijke teksten en lessen
        </h1>
        <p className="mt-4 text-muted-foreground">
          Met een abonnement krijg je onbeperkt toegang tot alle complete lessenseries volgens
          de 3V-leesroutine.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Rijke Teksten is nog in bèta. Probeer daarom nu 5 lessen gratis uit, zonder
          abonnement.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <h2 className="mb-2 text-center text-xl font-semibold tracking-tight">
          Binnenkort: abonnementen
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Lees Routine is nu nog in bèta. Er is nog geen prijs bekend en aanmelden voor een
          abonnement kan nog niet — voorlopig kun je 5 lessen gratis bekijken.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? "ring-2 ring-primary" : undefined}
            >
              <CardHeader>
                <Badge className="mb-1 w-fit" variant={plan.highlighted ? undefined : "secondary"}>
                  Binnenkort beschikbaar
                </Badge>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.tagline}</CardDescription>
                <p className="pt-2">
                  <span className="text-3xl font-semibold">Nog geen prijs</span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                {/* TODO: koppel aan een betaalprovider zoals Mollie of Stripe zodra de bèta afloopt. */}
                <Button variant={plan.highlighted ? "default" : "outline"} disabled>
                  Nog niet beschikbaar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          We laten je weten zodra abonnementen beschikbaar zijn.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <h2 className="mb-2 text-xl font-semibold tracking-tight">Veelgestelde vragen</h2>
        <Accordion>
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-3xl px-6 pt-4 pb-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-primary/10 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-semibold">Nu in bèta: 5 lessen gratis</h2>
            <p className="text-sm text-muted-foreground">
              Zolang we in bèta zijn kun je 5 lessen gratis bekijken om kennis te maken met de
              methode. Abonnementen volgen later.
            </p>
          </div>
          <Button render={<Link href="/lessen" />} className="shrink-0">
            Bekijk de gratis lessen
          </Button>
        </div>
      </section>
    </>
  );
}

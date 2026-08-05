export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Lees Routine
        <br />
        <span className="text-primary">Klaar voor je les.</span>
      </h1>
      <p className="max-w-lg text-balance text-muted-foreground">
        Gratis lessen bij rijke teksten om direct in te zetten in de klas.
        <br />
        Gebaseerd op de 3V-leesroutine.
      </p>
    </section>
  );
}

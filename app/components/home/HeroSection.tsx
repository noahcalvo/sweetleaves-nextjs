type HeroSectionProps = {
  header: string;
  subheader?: string;
};

export default function HeroSection({ header, subheader }: HeroSectionProps) {
  if (!header && !subheader) return null;

  return (
    <section className="pt-2 space-y-8">
      <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">{header}</h1>
      {subheader ? <h2 className="text-lg text-zinc-600 dark:text-zinc-400">{subheader}</h2> : null}
    </section>
  );
}

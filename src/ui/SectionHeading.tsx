/** Props for {@link SectionHeading}. */
interface SectionHeadingProps {
  /** Id of the `<h2>`, referenced by the section's `aria-labelledby`. */
  id: string;
  /** Short HUD label above the title, such as "02 / Services". */
  eyebrow: string;
  title: string;
  intro?: string;
}

/** The shared heading block that opens every content section; reveals on scroll. */
export function SectionHeading({ id, eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <div data-reveal className="max-w-3xl">
      <p className="label-mono flex items-center gap-4 text-accent-cool">
        <span aria-hidden="true" className="h-px w-10 bg-accent-cool" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-5 font-display text-5xl font-medium tracking-tight md:text-7xl">
        {title}
      </h2>
      {intro && <p className="mt-6 max-w-xl text-lg text-ink-muted">{intro}</p>}
    </div>
  );
}

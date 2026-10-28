import { projects } from '../content/projects';
import { ChipList } from '../ui/ChipList';
import { SectionHeading } from '../ui/SectionHeading';

/** Delivered projects, each with a screenshot, summary, stack and a link to the live product. */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-heading" className="px-6 py-36 md:px-10">
      <SectionHeading
        id="work-heading"
        eyebrow="03 / Work"
        title="Products we have shipped"
        intro="Live platforms in production, from enterprise event systems to B2B marketplaces."
      />
      <ul className="mt-16 grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            data-reveal
            data-testid={`project-${project.slug}`}
            className="hud-frame group flex flex-col border border-line bg-space-raised/85 p-3 transition-colors duration-500 hover:border-accent-cool/50"
          >
            <div className="overflow-hidden">
              <img
                src={`/images/work/${project.slug}.webp`}
                width={960}
                height={480}
                alt={`Screenshot of ${project.name}`}
                loading="lazy"
                decoding="async"
                className="aspect-2/1 w-full object-cover object-top transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <p className="label-mono flex justify-between gap-4 text-accent-cool">
                <span>{project.category}</span>
                <span aria-hidden="true" className="text-ink-muted">
                  [{String(index + 1).padStart(2, '0')}]
                </span>
              </p>
              <h3 className="font-display text-3xl font-medium tracking-tight">{project.name}</h3>
              <p className="text-ink-muted">{project.summary}</p>
              <ChipList label={`${project.name} technologies`} items={project.stack} />
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`project-${project.slug}-link`}
                className="label-mono mt-auto inline-flex items-center gap-3 self-start pt-3 text-ink transition-colors hover:text-accent-cool"
              >
                Visit live site
                <span className="sr-only"> for {project.name} (opens in a new tab)</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

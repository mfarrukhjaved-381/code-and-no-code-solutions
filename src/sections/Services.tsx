import { services } from '../content/services';
import { scrollStopProps } from '../shared/scrollStops';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * What the unit offers, as HUD panels. Also the final camera stop: arriving here lifts the
 * camera above the corridor for a wide look back over the world.
 */
export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="px-6 py-36 md:px-10"
      {...scrollStopProps}
    >
      <SectionHeading
        id="services-heading"
        eyebrow="02 / Services"
        title="Built with code, or without it"
        intro="We pick the approach that ships your product fastest and keeps it fast as it grows."
      />
      <ul className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <li
            key={service.id}
            data-reveal
            data-testid={`service-${service.id}`}
            className="hud-frame group border border-line bg-space-raised/85 p-8 transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1 hover:border-accent-cool/50 hover:shadow-[0_0_60px_-24px] hover:shadow-accent-cool"
          >
            <p aria-hidden="true" className="label-mono text-accent-cool">
              [{String(index + 1).padStart(2, '0')}]
            </p>
            <h3 className="mt-10 font-display text-3xl font-medium tracking-tight">
              {service.name}
            </h3>
            <p className="mt-4 text-ink-muted">{service.summary}</p>
            <span
              aria-hidden="true"
              className="mt-8 block h-px origin-left scale-x-0 bg-linear-to-r from-accent-cool to-accent transition-transform duration-700 group-hover:scale-x-100"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

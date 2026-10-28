import { services } from '../content/services';
import { site } from '../content/site';
import { scrollStopProps } from '../shared/scrollStops';

const headlineServices = services.slice(0, 4).map((service) => service.name);

/**
 * The first screen: the giant welcome heading bottom-left, what we build top-right, and the
 * invitation to enter bottom-right, leaving the centre to the 3D portal.
 *
 * The heading is the page's LCP element, so it must stay plain text in the prerendered HTML.
 * Its entrance animation starts blurred but fully opaque, so it still counts as painted on the
 * first frame. It is also the first camera stop: the view through the portal.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      data-testid="hero-section"
      className="relative grid min-h-svh grid-rows-[1fr_auto] px-6 pt-28 pb-12 md:px-10 lg:pb-28"
      {...scrollStopProps}
    >
      <ul
        aria-label="What we build"
        className="label-mono hidden space-y-3 justify-self-end text-right text-ink/80 lg:block"
      >
        {headlineServices.map((name, index) => (
          <li
            key={name}
            className={`motion-safe:animate-fade-up ${
              [
                '[animation-delay:500ms]',
                '[animation-delay:600ms]',
                '[animation-delay:700ms]',
                '[animation-delay:800ms]',
              ][index] ?? ''
            }`}
          >
            {name}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label-mono flex items-center gap-4 text-accent-cool motion-safe:animate-fade-up">
            <span aria-hidden="true" className="h-px w-10 bg-accent-cool" />
            Code · No Code · AI
          </p>
          <h1 id="hero-heading" className="mt-6 font-display font-medium">
            {/* Spaces sit inside the spans so the heading reads as one phrase to assistive tech. */}
            <span className="label-mono block text-ink-muted motion-safe:animate-fade-up">
              {'Welcome to '}
            </span>
            <span className="text-hero mt-4 block motion-safe:animate-focus-in">Code and</span>
            <span className="text-hero block motion-safe:animate-focus-in motion-safe:[animation-delay:120ms]">
              {' No Code'}
            </span>
            <span className="mt-4 block text-3xl tracking-tight text-ink-muted motion-safe:animate-focus-in motion-safe:[animation-delay:240ms] md:text-5xl">
              {' Solutions'}
            </span>
          </h1>
        </div>

        <div className="max-w-md motion-safe:animate-fade-up motion-safe:[animation-delay:400ms] lg:text-right">
          <p className="label-mono text-ink-muted">
            A unit of{' '}
            <a
              href={site.parentUrl}
              data-testid="hero-parent-link"
              className="text-ink underline decoration-accent-cool underline-offset-4 hover:decoration-ink"
            >
              {site.parentCompany}
            </a>
          </p>
          <p className="mt-4 text-lg text-ink/80">{site.tagline}</p>
          <a
            href="#team"
            data-testid="hero-enter-link"
            className="group mt-10 inline-flex items-center gap-6"
          >
            <span className="font-display text-lg tracking-[0.25em] uppercase md:text-xl">
              Enter the world
            </span>
            <span
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full border border-ink/40 transition-colors duration-300 group-hover:bg-ink group-hover:text-space"
            >
              ↓
            </span>
          </a>
          <p className="label-mono mt-6 text-ink-muted">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}

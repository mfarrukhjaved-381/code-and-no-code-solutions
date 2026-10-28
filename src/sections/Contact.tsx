import { site } from '../content/site';

/**
 * Direct contact links. No form on purpose: the site has no backend, and a form would need a
 * third-party processor for a channel email and WhatsApp already cover.
 */
export function Contact() {
  const { contact } = site;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="flex min-h-svh flex-col justify-center px-6 py-36 md:px-10"
    >
      <div data-reveal>
        <p className="label-mono flex items-center gap-4 text-accent-cool">
          <span aria-hidden="true" className="h-px w-10 bg-accent-cool" />
          04 / Contact
        </p>
        <h2 id="contact-heading" className="text-hero mt-6 font-display font-medium">
          Let&apos;s build
          <span className="block text-ink-muted">what&apos;s next.</span>
        </h2>
        <p className="mt-8 max-w-xl text-lg text-ink-muted">
          Tell us about your product, and we will help you decide how to build it.
        </p>
      </div>

      <div
        data-reveal
        className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <a
          href={`mailto:${contact.email}`}
          data-testid="contact-email-link"
          // wrap-anywhere: an email address has no spaces, so at phone widths it would otherwise
          // refuse to wrap and widen the whole page (measured: 420 px on a 390 px screen).
          className="font-display text-2xl tracking-tight wrap-anywhere underline decoration-accent-cool/50 underline-offset-8 transition-colors hover:decoration-ink sm:text-3xl md:text-5xl"
        >
          {contact.email}
        </a>
        <ul className="flex flex-wrap gap-4">
          <li>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp-link"
              className="label-mono inline-block border border-ink bg-ink px-6 py-4 text-space transition-colors hover:bg-transparent hover:text-ink"
            >
              WhatsApp ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={contact.phoneHref}
              data-testid="contact-phone-link"
              className="label-mono inline-block border border-ink/30 px-6 py-4 transition-colors hover:border-ink"
            >
              {contact.phoneDisplay}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

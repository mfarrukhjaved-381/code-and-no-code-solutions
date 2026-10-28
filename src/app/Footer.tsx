import { site } from '../content/site';

/**
 * Page footer with the unit's relationship to its parent company. Bottom padding on desktop
 * keeps it clear of the fixed section bar.
 */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="label-mono flex flex-col gap-3 px-6 pt-10 pb-10 text-ink-muted sm:flex-row sm:justify-between md:px-10 md:pb-28">
        <p>{site.name}</p>
        <p>
          A unit of{' '}
          <a href={site.parentUrl} className="text-ink hover:text-accent-cool">
            {site.parentCompany}
          </a>
        </p>
      </div>
    </footer>
  );
}

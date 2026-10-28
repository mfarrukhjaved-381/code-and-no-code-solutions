import { site } from '../content/site';
import { SoundToggle } from './SoundToggle';

/**
 * Fixed top bar: the brand mark on the left, sound and the project call to action on the right.
 * Section navigation lives in the bottom bar (`SectionNav`), as in the HUD layout.
 * No backdrop blur on purpose: blurring a live WebGL canvas re-runs the blur on every frame.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-linear-to-b from-space/90 to-transparent">
      <div className="flex h-20 items-center justify-between gap-4 px-5 md:px-10">
        {/* The accessible name is the visible brand text (WCAG 2.5.3); the badge is decoration.
            On phones the name is visually hidden for space but still read out. */}
        <a href="#top" data-testid="header-home-link" className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center border border-ink/30 font-display text-sm font-semibold"
          >
            {site.shortName}
          </span>
          <span className="label-mono sr-only text-ink/80 sm:not-sr-only">{site.name}</span>
        </a>
        <div className="flex items-center gap-8">
          <div className="hidden md:block">
            <SoundToggle />
          </div>
          <a
            href="#contact"
            data-testid="header-contact-link"
            className="label-mono shrink-0 border border-ink/30 px-3 py-2.5 transition-colors hover:border-ink hover:bg-ink hover:text-space sm:px-4 sm:py-3"
          >
            {/* Short label on phones: the full one pushed a 390 px layout to 421 px. */}
            <span className="sm:hidden">Contact</span>
            <span className="hidden sm:inline">Start a project</span>
          </a>
        </div>
      </div>
    </header>
  );
}

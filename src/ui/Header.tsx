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
      <div className="flex h-20 items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          data-testid="header-home-link"
          aria-label={`${site.name}, back to top`}
          className="flex items-center gap-4"
        >
          <span className="grid h-10 w-10 place-items-center border border-ink/30 font-display text-sm font-semibold">
            {site.shortName}
          </span>
          <span className="label-mono hidden text-ink/80 sm:block">{site.name}</span>
        </a>
        <div className="flex items-center gap-8">
          <div className="hidden md:block">
            <SoundToggle />
          </div>
          <a
            href="#contact"
            data-testid="header-contact-link"
            className="label-mono border border-ink/30 px-4 py-3 transition-colors hover:border-ink hover:bg-ink hover:text-space"
          >
            Start a project
          </a>
        </div>
      </div>
    </header>
  );
}

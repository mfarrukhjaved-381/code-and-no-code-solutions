import { playBlip } from '../app/ambientSound';
import { navLinks } from '../content/site';
import { useActiveId } from '../hooks/useActiveId';

const sectionIds = navLinks.map((link) => link.id);

/**
 * Fixed bottom bar listing every section with its index, highlighting the one in view. Plain
 * anchors, so it works before hydration; the highlight is the only part that needs JavaScript.
 */
export function SectionNav() {
  const activeId = useActiveId(sectionIds);

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 border border-line bg-space/85 md:block"
    >
      <ol className="flex">
        {navLinks.map((link, index) => {
          const isActive = link.id === activeId;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={isActive ? 'location' : undefined}
                data-testid={`section-nav-${link.id}`}
                onPointerEnter={playBlip}
                className={`label-mono relative block px-5 py-4 transition-colors hover:text-ink ${
                  isActive ? 'text-ink' : 'text-ink-muted'
                }`}
              >
                <span className={isActive ? 'text-accent-cool' : undefined}>
                  {String(index).padStart(2, '0')}
                </span>{' '}
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-px h-0.5 bg-accent-cool transition-transform duration-500 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

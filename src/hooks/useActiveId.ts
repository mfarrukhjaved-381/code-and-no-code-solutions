import { useEffect, useState } from 'react';

/**
 * Returns the id of whichever of the given elements currently crosses the middle of the
 * viewport, or null when none does.
 *
 * Uses an IntersectionObserver with a band at the viewport centre, so the browser reports
 * crossings itself; nothing runs on scroll. `ids` must be a stable reference (define it at
 * module level), or the observer is rebuilt on every render.
 */
export function useActiveId(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Resolve in list order so the result is deterministic if two ever overlap the band.
        setActiveId(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => {
      observer.disconnect();
    };
  }, [ids]);

  return activeId;
}

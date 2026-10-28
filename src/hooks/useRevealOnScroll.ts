import { useEffect } from 'react';

/**
 * Fades and lifts every `[data-reveal]` element into place the first time it scrolls into view.
 *
 * Content is hidden only after this runs (it adds `reveal-ready` to the root), so the
 * prerendered HTML, no-JavaScript visitors and reduced-motion visitors always see everything.
 * Each element is unobserved once revealed, so the observer's work shrinks as the page is read.
 */
export function useRevealOnScroll(): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );

    root.classList.add('reveal-ready');
    for (const element of document.querySelectorAll('[data-reveal]')) {
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);
}

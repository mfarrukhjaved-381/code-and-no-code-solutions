/**
 * The team lead's crown. Decorative: the "Team Lead" title beside it carries the meaning for
 * assistive technology, so the icon is hidden from it.
 */
export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M2.5 7.5 7 11l5-7 5 7 4.5-3.5L19 18H5L2.5 7.5Z" />
      <rect x="5" y="19.5" width="14" height="2" rx="1" />
    </svg>
  );
}

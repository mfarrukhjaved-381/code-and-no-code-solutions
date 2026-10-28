/**
 * An endlessly scrolling band of outlined words. The list is rendered twice and the track moves
 * by exactly half its width, so the loop is seamless. Decorative (the same words appear as real
 * content in Services), so it is hidden from assistive technology. Pure CSS animation on the
 * compositor; it stands still for reduced-motion visitors.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line py-8">
      <div className="flex w-max motion-safe:animate-marquee">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-10 pr-10 font-display text-5xl font-semibold tracking-tight uppercase md:text-7xl"
              >
                <span className="text-outline">{item}</span>
                <span className="text-2xl text-accent-cool">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

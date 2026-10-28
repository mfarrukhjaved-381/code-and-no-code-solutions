/** Props for {@link ChipList}. */
interface ChipListProps {
  /** Accessible name for the list, such as "Skills" or "Technologies". */
  label: string;
  items: readonly string[];
}

/** A row of small monospace tags, used for member skills and project stacks. */
export function ChipList({ label, items }: ChipListProps) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="border border-line px-2.5 py-1 font-mono text-[0.68rem] tracking-wider text-ink-muted uppercase"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

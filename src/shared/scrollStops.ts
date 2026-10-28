/**
 * The contract between the scrolling page and the 3D camera.
 *
 * Page sections that the camera should "arrive at" carry the `data-stop` attribute. Their
 * document positions, in DOM order, are the stops: the hero, each team member, then the
 * services section. The scene turns the current scroll position into a fractional stop index
 * and flies the camera between matching keyframes, so the 3D view stays in step with whichever
 * card is on screen, whatever the section heights are.
 *
 * Lives in `shared/` because both the DOM sections and the scene depend on it; neither side
 * depends on the other.
 */

/** Spread onto an element to make it a camera stop. */
export const scrollStopProps = { 'data-stop': '' } as const;

const STOP_SELECTOR = '[data-stop]';

/** Reads each stop's top edge in document coordinates, in DOM order. Triggers layout: call on resize, not per frame. */
export function measureStopTops(): number[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(STOP_SELECTOR),
    (element) => element.getBoundingClientRect().top + window.scrollY,
  );
}

/**
 * Maps a scroll position to a fractional stop index: 0 at the first stop, 1 when the second
 * stop's top reaches the top of the viewport, and so on, clamped to the last stop.
 */
export function stopProgress(scrollY: number, stopTops: readonly number[]): number {
  const lastIndex = stopTops.length - 1;
  for (let index = 0; index < lastIndex; index++) {
    const start = stopTops[index] ?? 0;
    const end = stopTops[index + 1] ?? start;
    if (scrollY < end) {
      const span = end - start;
      // Zero-height spans (stops at the same position) count as already passed.
      const fraction = span > 0 ? (scrollY - start) / span : 1;
      return index + Math.min(Math.max(fraction, 0), 1);
    }
  }
  return Math.max(lastIndex, 0);
}

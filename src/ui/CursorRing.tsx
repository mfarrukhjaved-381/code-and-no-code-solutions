import { useEffect, useRef } from 'react';

/** Fraction of the remaining distance covered per frame; lower trails further behind. */
const FOLLOW = 0.2;

/**
 * A ring that trails the pointer and grows over links and buttons. Desktop pointers only, and
 * never with reduced motion. The native cursor stays visible: this is decoration, not a
 * replacement. Position is written straight to the element's transform inside
 * requestAnimationFrame (no React state), and the loop stops once the ring has caught up.
 */
export function CursorRing() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ring.current;
    const canHover = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!element || !canHover || reduceMotion) return;

    const current = { x: -100, y: -100, scale: 1 };
    const target = { x: -100, y: -100, scale: 1 };
    let frame = 0;

    const render = () => {
      current.x += (target.x - current.x) * FOLLOW;
      current.y += (target.y - current.y) * FOLLOW;
      current.scale += (target.scale - current.scale) * FOLLOW;
      element.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${current.scale.toFixed(3)})`;
      const settled =
        Math.abs(target.x - current.x) < 0.1 &&
        Math.abs(target.y - current.y) < 0.1 &&
        Math.abs(target.scale - current.scale) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      const overInteractive =
        event.target instanceof Element && event.target.closest('a, button') !== null;
      target.scale = overInteractive ? 1.9 : 1;
      element.style.opacity = '1';
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 h-8 w-8 rounded-full border border-ink/60 opacity-0 transition-opacity duration-300"
    />
  );
}

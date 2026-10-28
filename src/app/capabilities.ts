/**
 * Decides, in the browser and after hydration, whether the galaxy renders and at what quality.
 */

/** `full` for capable desktops, `lite` for touch devices and low core counts. */
export type QualityTier = 'full' | 'lite';

/**
 * Returns the tier to render at, or null when the galaxy must not render at all: the visitor
 * asked for reduced motion, or the browser has no WebGL2. Null leaves the static backdrop, which
 * is a complete experience on its own.
 */
export function detectQualityTier(): QualityTier | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (!supportsWebGL2()) return null;

  const isTouchFirst = window.matchMedia('(pointer: coarse)').matches;
  const hasFewCores = navigator.hardwareConcurrency <= 4;
  return isTouchFirst || hasFewCores ? 'lite' : 'full';
}

function supportsWebGL2(): boolean {
  try {
    const context = document.createElement('canvas').getContext('webgl2');
    // Release the probe context at once: browsers cap live WebGL contexts, and the real
    // renderer needs one of them.
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

/**
 * Runs `callback` once the browser is idle after first paint, so the 3D download and shader
 * compilation never compete with the content the visitor is waiting for. Returns a canceller.
 */
export function whenIdle(callback: () => void): () => void {
  // Checked through an optional view of window: the DOM typings declare requestIdleCallback
  // always present, but Safari still lacks it. The call itself stays on window, bound.
  const idleCapable: Partial<Pick<Window, 'requestIdleCallback'>> = window;
  if (idleCapable.requestIdleCallback) {
    const handle = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => {
      window.cancelIdleCallback(handle);
    };
  }
  const handle = window.setTimeout(callback, 300);
  return () => {
    window.clearTimeout(handle);
  };
}

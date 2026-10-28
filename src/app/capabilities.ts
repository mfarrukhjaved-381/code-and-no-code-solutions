/**
 * Decides, in the browser and after hydration, whether the galaxy renders and at what quality.
 */

/** `full` for capable desktops, `lite` for touch devices and low core counts. */
export type QualityTier = 'full' | 'lite';

/**
 * Returns the tier to render at, or null when the galaxy must not render at all: the visitor
 * asked for reduced motion, the browser has no WebGL2, or WebGL runs on the CPU. Null leaves the
 * static backdrop, which is a complete experience on its own.
 */
export function detectQualityTier(): QualityTier | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (probeWebGL2() !== 'hardware') return null;

  const isTouchFirst = window.matchMedia('(pointer: coarse)').matches;
  const hasFewCores = navigator.hardwareConcurrency <= 4;
  return isTouchFirst || hasFewCores ? 'lite' : 'full';
}

/**
 * The next tier down after the scene measured too slow at `tier`: full drops to lite, lite turns
 * the 3D off. See `scene/FrameGuard`.
 */
export function downgradeTier(tier: QualityTier): QualityTier | null {
  return tier === 'full' ? 'lite' : null;
}

/**
 * Renderer names of CPU implementations of WebGL. They do work: SwiftShader drew the scene at
 * 8 fps in testing, blocking the main thread for minutes, so on them the static backdrop is the
 * better experience. Headless test browsers (including Lighthouse and PageSpeed) report these too.
 */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

type WebGLSupport = 'none' | 'software' | 'hardware';

function probeWebGL2(): WebGLSupport {
  try {
    const context = document.createElement('canvas').getContext('webgl2');
    if (!context) return 'none';
    // Firefox and Safari mask the debug extension but report a comparable string as RENDERER.
    const debugInfo = context.getExtension('WEBGL_debug_renderer_info');
    const renderer: unknown = context.getParameter(
      debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : context.RENDERER,
    );
    // Release the probe context at once: browsers cap live WebGL contexts, and the real
    // renderer needs one of them.
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return typeof renderer === 'string' && SOFTWARE_RENDERER.test(renderer)
      ? 'software'
      : 'hardware';
  } catch {
    return 'none';
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

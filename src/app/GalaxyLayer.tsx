import { lazy, Suspense, useEffect, useState } from 'react';
import { detectQualityTier, whenIdle, type QualityTier } from './capabilities';
import { ErrorBoundary } from './ErrorBoundary';

// The only import of the scene. Being dynamic, three.js and React Three Fiber land in their own
// chunk that `index.html` never references, so they cost nothing before first paint.
const GalaxyCanvas = lazy(() => import('../scene/GalaxyCanvas'));

/**
 * Mounts the 3D galaxy behind the page, if and when it should exist.
 *
 * Renders nothing during the prerender and the hydration pass (so the markup matches), then
 * checks the device, waits for the browser to go idle, and only then starts loading the scene.
 * Any failure inside falls back to nothing, leaving the static backdrop and the full HTML site.
 */
export function GalaxyLayer() {
  const [tier, setTier] = useState<QualityTier | null>(null);

  useEffect(() => {
    const detectedTier = detectQualityTier();
    if (!detectedTier) return;
    return whenIdle(() => {
      setTier(detectedTier);
    });
  }, []);

  if (!tier) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <GalaxyCanvas tier={tier} />
      </Suspense>
    </ErrorBoundary>
  );
}

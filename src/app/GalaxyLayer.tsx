import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { detectQualityTier, downgradeTier, whenIdle, type QualityTier } from './capabilities';
import { ErrorBoundary } from './ErrorBoundary';

// The only import of the scene. Being dynamic, three.js and React Three Fiber land in their own
// chunk that `index.html` never references, so they cost nothing before first paint.
const GalaxyCanvas = lazy(() => import('../scene/GalaxyCanvas'));

/**
 * Mounts the 3D world behind the page, if and when it should exist, and owns its quality tier.
 *
 * Renders nothing during the prerender and the hydration pass (so the markup matches), then
 * checks the device, waits for the browser to go idle, and only then starts loading the scene.
 * If the scene then measures too slow it steps down a tier, and off entirely below the lowest.
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

  const handleSlow = useCallback(() => {
    setTier((current) => (current ? downgradeTier(current) : null));
  }, []);

  if (!tier) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <GalaxyCanvas tier={tier} onSlow={handleSlow} />
      </Suspense>
    </ErrorBoundary>
  );
}

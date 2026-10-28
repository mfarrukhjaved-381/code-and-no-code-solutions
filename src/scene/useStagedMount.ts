import { useEffect, useState } from 'react';
import { whenIdle } from '../app/capabilities';

/**
 * Counts from 0 up to `stageCount`, advancing one step each time the browser goes idle.
 *
 * Gating scene layers on the returned stage mounts them one per idle period, so each layer's
 * shader compilation and buffer generation runs in its own task. Mounting everything at once
 * made a single blocking task of 3.3 s on a throttled mobile CPU.
 */
export function useStagedMount(stageCount: number): number {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= stageCount) return;
    return whenIdle(() => {
      setStage((current) => current + 1);
    });
  }, [stage, stageCount]);

  return stage;
}

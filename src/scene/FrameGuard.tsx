import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

/** Time ignored at start, while shaders compile and layers mount, so it does not count as slow. */
const WARMUP_SECONDS = 1.5;
/** Time over which frames are sampled after warm-up. */
const SAMPLE_SECONDS = 2;

/** Props for {@link FrameGuard}. */
interface FrameGuardProps {
  /** Median frame time above this, in seconds, counts as too slow. */
  maxFrameSeconds: number;
  /** Called once if the scene is too slow for this device. */
  onSlow: () => void;
}

/**
 * Measures real frame times once, after warm-up, and reports a device that cannot keep up.
 *
 * Detection before rendering (see `app/capabilities`) cannot catch every slow GPU, so this is
 * the second line of defence. Windows are measured in time, not frames: a fixed frame count
 * took 25 seconds per verdict at 8 fps in testing, which is exactly the device that needs a fast
 * verdict. The median, not the mean, keeps one hitch from downgrading a capable device. It stops
 * after the verdict; remount it (by key) to measure again at a new quality tier.
 */
export function FrameGuard({ maxFrameSeconds, onSlow }: FrameGuardProps) {
  const elapsed = useRef(0);
  const samples = useRef<number[]>([]);
  const settled = useRef(false);

  useFrame((_, delta) => {
    if (settled.current) return;
    elapsed.current += delta;
    if (elapsed.current <= WARMUP_SECONDS) return;

    samples.current.push(delta);
    if (elapsed.current < WARMUP_SECONDS + SAMPLE_SECONDS) return;

    settled.current = true;
    const sorted = samples.current.toSorted((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
    if (median > maxFrameSeconds) onSlow();
  });

  return null;
}

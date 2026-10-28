import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector2, Vector3 } from 'three';
import { measureStopTops, stopProgress } from '../shared/scrollStops';
import { cameraKeyframes, sampleCameraPath } from './worldLayout';

/** Higher is snappier. The damping turns scroll-wheel steps into a continuous glide. */
const FOLLOW_RATE = 3.2;
/** How far the camera leans toward the pointer, in world units. */
const PARALLAX = new Vector2(0.45, 0.25);

// Per-frame scratch values at module scope: one rig exists per page, and reusing them keeps the
// frame loop allocation free.
const desiredPosition = new Vector3();
const desiredTarget = new Vector3();
const currentTarget = cameraKeyframes[0]?.target.clone() ?? new Vector3();
/** Pointer position normalised to -1..1, written by a window listener (the canvas ignores pointer events). */
const pointer = new Vector2();

/**
 * Flies the camera along the keyframe path in step with page scroll, leaning slightly toward
 * the pointer for depth.
 *
 * Stop positions are measured on load and whenever the page resizes (images and fonts change
 * its height); each frame only reads `scrollY`, which forces no layout. Nothing here touches
 * React state, so scrolling causes no re-renders.
 */
export function CameraRig() {
  const stopTops = useRef<number[]>([]);

  useEffect(() => {
    const measure = () => {
      stopTops.current = measureStopTops();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    const onPointerMove = (event: PointerEvent) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useFrame(({ camera }, delta) => {
    sampleCameraPath(
      stopProgress(window.scrollY, stopTops.current),
      desiredPosition,
      desiredTarget,
    );
    desiredPosition.x += pointer.x * PARALLAX.x;
    desiredPosition.y += pointer.y * PARALLAX.y;
    // Frame-rate independent exponential damping: the same feel at 30 fps and 144 fps.
    const follow = 1 - Math.exp(-FOLLOW_RATE * delta);
    camera.position.lerp(desiredPosition, follow);
    currentTarget.lerp(desiredTarget, follow);
    camera.lookAt(currentTarget);
  });

  return null;
}

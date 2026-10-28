/**
 * Where everything sits in the 3D world, and the camera keyframes that visit it.
 *
 * One module owns the geometry so the portals and the camera path can never disagree about a
 * position. The world is a corridor running into the screen (negative z): the hero portal at the
 * origin, then one portal per team member, alternating sides. Keyframes line up one-to-one with
 * the page's scroll stops: hero, each member, then the outro shown from the services section on.
 */
import { Vector3 } from 'three';
import { team } from '../content/team';

/** Height of the grid floor; portals stand on it. */
export const FLOOR_Y = -1.8;
/** Distance along the corridor between consecutive member portals. */
const STATION_SPACING = 16;
/** Sideways offset of member portals, so each sits beside its card rather than behind it. */
const STATION_SIDE = 2.8;
/** How far in front of a portal the camera stops. */
const VIEW_DISTANCE = 7.5;

/** Centre of the large hero portal. */
export const heroPortalPosition = new Vector3(0, 0.4, 0);

/**
 * Centre of each member's portal, in team order. Member cards alternate sides (first on the
 * left), so portals alternate the other way: first on the right.
 */
export const stationPositions: readonly Vector3[] = team.map(
  (_, index) =>
    new Vector3(
      index % 2 === 0 ? STATION_SIDE : -STATION_SIDE,
      0.2,
      -STATION_SPACING * (index + 1),
    ),
);

/** A camera pose: where it is and the point it looks at. */
export interface CameraKeyframe {
  position: Vector3;
  target: Vector3;
}

const overview: CameraKeyframe = {
  position: new Vector3(0, 0.5, 9.5),
  target: new Vector3(0, 0.3, 0),
};

/**
 * Looking straight down the corridor from a point offset toward the card's side puts the portal
 * in the free half of the screen. The path from the hero to the first member crosses z = 0
 * inside the hero portal, so the camera flies through it.
 */
const memberKeyframes: CameraKeyframe[] = stationPositions.map((station) => {
  const cameraX = station.x * 0.15;
  return {
    position: new Vector3(cameraX, 0.6, station.z + VIEW_DISTANCE),
    target: new Vector3(cameraX, 0.3, station.z),
  };
});

const lastStationZ = stationPositions.at(-1)?.z ?? 0;

/** High above the far end of the corridor, looking back over every portal toward the start. */
const outro: CameraKeyframe = {
  position: new Vector3(0, 10, lastStationZ - 14),
  target: new Vector3(0, -1, lastStationZ + 22),
};

export const cameraKeyframes: readonly CameraKeyframe[] = [overview, ...memberKeyframes, outro];

/** Smoothstep easing, so the camera eases into and out of each stop instead of moving linearly. */
function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Writes the pose at fractional keyframe index `progress` into the output vectors. Writes into
 * caller-owned vectors because it runs every frame, and allocating there would feed the
 * garbage collector 60 times a second.
 */
export function sampleCameraPath(progress: number, outPosition: Vector3, outTarget: Vector3): void {
  const lastIndex = cameraKeyframes.length - 1;
  const clamped = Math.min(Math.max(progress, 0), lastIndex);
  const index = Math.floor(clamped);
  const from = cameraKeyframes[index] ?? overview;
  const to = cameraKeyframes[Math.min(index + 1, lastIndex)] ?? from;
  const t = ease(clamped - index);
  outPosition.lerpVectors(from.position, to.position, t);
  outTarget.lerpVectors(from.target, to.target, t);
}

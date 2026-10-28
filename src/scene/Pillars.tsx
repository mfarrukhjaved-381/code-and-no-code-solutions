import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  Color,
  type InstancedMesh,
  type MeshBasicMaterial,
  Object3D,
} from 'three';
import { GlowPoints } from './GlowPoints';
import { createRandom } from './random';
import { FLOOR_Y } from './worldLayout';

const PILLAR_COUNT = 56;
const BEAM_COUNT = 40;

interface Placement {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
}

/** Positions either side of the corridor, keeping its centre clear for the camera path. */
function placeAlongCorridor(
  count: number,
  seed: number,
  size: (random: () => number) => { width: number; height: number; y: number },
): Placement[] {
  const random = createRandom(seed);
  return Array.from({ length: count }, () => {
    const side = random() < 0.5 ? -1 : 1;
    return {
      x: side * (7 + random() * 22),
      z: 14 - random() * 105,
      ...size(random),
    };
  });
}

const pillars = placeAlongCorridor(PILLAR_COUNT, 11, (random) => {
  const height = 8 + random() * 22;
  return { width: 0.8 + random() * 1.6, height, y: FLOOR_Y + height / 2 };
});

const beams = placeAlongCorridor(BEAM_COUNT, 23, (random) => {
  const height = 3 + random() * 10;
  return { width: 0.03, height, y: FLOOR_Y + 2 + random() * 8 };
});

/** Bright points at the top of each light beam, the "spark" seen in the reference look. */
const beamTips = (() => {
  const positions = new Float32Array(BEAM_COUNT * 3);
  const colours = new Float32Array(BEAM_COUNT * 3);
  const sizes = new Float32Array(BEAM_COUNT).fill(9);
  const tipColour = new Color('#dfe5ff');
  beams.forEach((beam, index) => {
    positions.set([beam.x, beam.y + beam.height / 2, beam.z], index * 3);
    tipColour.toArray(colours, index * 3);
  });
  return { positions, colours, sizes };
})();

/** Writes each placement into an instanced mesh as a scaled box. */
function applyLayout(target: InstancedMesh, placements: readonly Placement[]): void {
  const dummy = new Object3D();
  placements.forEach((placement, index) => {
    dummy.position.set(placement.x, placement.y, placement.z);
    dummy.scale.set(placement.width, placement.height, placement.width);
    dummy.updateMatrix();
    target.setMatrixAt(index, dummy.matrix);
  });
  target.instanceMatrix.needsUpdate = true;
}

/**
 * Dark monoliths and thin light beams lining the corridor. Each group is a single instanced
 * mesh, so 96 objects cost two draw calls. Fog fades them into the distance.
 */
export function Pillars() {
  const pillarMesh = useRef<InstancedMesh>(null);
  const beamMesh = useRef<InstancedMesh>(null);
  const beamMaterial = useRef<MeshBasicMaterial>(null);
  const beamColour = useMemo(() => new Color('#9fb0ff'), []);

  // Layout before first paint, so the instances never flash at the origin.
  useLayoutEffect(() => {
    if (pillarMesh.current) applyLayout(pillarMesh.current, pillars);
    if (beamMesh.current) applyLayout(beamMesh.current, beams);
  }, []);

  useFrame(({ clock }) => {
    // A slow shared pulse makes the beams feel powered rather than painted on.
    if (beamMaterial.current) {
      beamMaterial.current.opacity = 0.55 + 0.3 * Math.sin(clock.elapsedTime * 1.3);
    }
  });

  return (
    <>
      <instancedMesh ref={pillarMesh} args={[undefined, undefined, PILLAR_COUNT]}>
        <boxGeometry />
        <meshBasicMaterial color="#0a0d1a" />
      </instancedMesh>
      <instancedMesh ref={beamMesh} args={[undefined, undefined, BEAM_COUNT]}>
        <boxGeometry />
        <meshBasicMaterial
          ref={beamMaterial}
          color={beamColour}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </instancedMesh>
      <GlowPoints {...beamTips} />
    </>
  );
}

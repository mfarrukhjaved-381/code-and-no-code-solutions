import { useMemo } from 'react';
import { Color } from 'three';
import { GlowPoints } from './GlowPoints';
import { createRandom, gaussian } from './random';
import { FLOOR_Y } from './worldLayout';

const GALAXY_RADIUS = 14;
const ARM_COUNT = 3;
/** Radians of twist per unit of radius: higher values wind the arms tighter. */
const ARM_TWIST = 0.38;

const CORE_COLOUR = new Color('#c9bcff');
const EDGE_COLOUR = new Color('#6f86ff');
const DUST_COLOURS = [new Color('#dfe3f2'), new Color('#8fa2ff'), new Color('#b9a8ff')];

interface PointBuffers {
  positions: Float32Array;
  colours: Float32Array;
  sizes: Float32Array;
}

function allocate(count: number): PointBuffers {
  return {
    positions: new Float32Array(count * 3),
    colours: new Float32Array(count * 3),
    sizes: new Float32Array(count),
  };
}

/** A three-armed spiral galaxy, dense at the core and thinning along the arms. */
function createGalaxy(count: number): PointBuffers {
  const random = createRandom(20261028);
  const buffers = allocate(count);
  const colour = new Color();
  for (let i = 0; i < count; i++) {
    const radius = Math.pow(random(), 1.7) * GALAXY_RADIUS;
    const angle = ((i % ARM_COUNT) / ARM_COUNT) * Math.PI * 2 + radius * ARM_TWIST;
    const scatter = 0.2 + (1 - radius / GALAXY_RADIUS) * 0.7;
    buffers.positions[i * 3] = Math.cos(angle) * radius + gaussian(random) * scatter;
    buffers.positions[i * 3 + 1] = gaussian(random) * scatter * 0.3;
    buffers.positions[i * 3 + 2] = Math.sin(angle) * radius + gaussian(random) * scatter;
    colour.copy(CORE_COLOUR).lerp(EDGE_COLOUR, radius / GALAXY_RADIUS);
    colour.toArray(buffers.colours, i * 3);
    buffers.sizes[i] = 1.5 + random() * 3;
  }
  return buffers;
}

/**
 * Floating dust around the corridor plus a far shell of stars. The shell gives depth whichever
 * way the camera looks; the dust gives parallax as the camera flies through it.
 */
function createDust(count: number): PointBuffers {
  const random = createRandom(7331);
  const buffers = allocate(count);
  const shellStart = Math.floor(count * 0.55);
  for (let i = 0; i < count; i++) {
    const offset = i * 3;
    if (i < shellStart) {
      buffers.positions[offset] = (random() - 0.5) * 60;
      buffers.positions[offset + 1] = FLOOR_Y + random() * 16;
      buffers.positions[offset + 2] = 14 - random() * 110;
      buffers.sizes[i] = 0.6 + random() * 1.4;
    } else {
      const distance = 90 + random() * 60;
      const theta = random() * Math.PI * 2;
      // Upper hemisphere only: below the horizon the floor and fog hide it anyway.
      const phi = Math.acos(random());
      buffers.positions[offset] = distance * Math.sin(phi) * Math.cos(theta);
      buffers.positions[offset + 1] = distance * Math.cos(phi) - 10;
      buffers.positions[offset + 2] = distance * Math.sin(phi) * Math.sin(theta) - 40;
      buffers.sizes[i] = 6 + random() * 10;
    }
    const colour = DUST_COLOURS[Math.floor(random() * DUST_COLOURS.length)] ?? CORE_COLOUR;
    colour.toArray(buffers.colours, offset);
  }
  return buffers;
}

/** The sky: a slowly turning spiral galaxy above the corridor, stars and drifting dust. */
export function Sky({ galaxyCount, dustCount }: { galaxyCount: number; dustCount: number }) {
  const galaxy = useMemo(() => createGalaxy(galaxyCount), [galaxyCount]);
  const dust = useMemo(() => createDust(dustCount), [dustCount]);

  return (
    <>
      {/* Tilted toward the viewer and far up the corridor, so it reads as a nebula on the horizon. */}
      <group position={[14, 22, -150]} rotation={[0.95, 0, 0.35]} scale={3.2}>
        <GlowPoints {...galaxy} spin={0.02} />
      </group>
      <GlowPoints {...dust} drift={0.25} />
    </>
  );
}

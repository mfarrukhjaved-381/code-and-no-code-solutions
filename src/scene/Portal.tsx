import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { AdditiveBlending, type Group, type InstancedMesh, type Mesh, Object3D } from 'three';
import { Crown } from './Crown';
import {
  PORTAL_GLOW_PADDING,
  PORTAL_HEIGHT,
  PORTAL_WIDTH,
  useFrameGlow,
  usePaneFill,
} from './textures';

const FRAME_THICKNESS = 0.045;
const TICK_COUNT = 72;

/** Props for {@link Portal}. */
export interface PortalProps {
  position: readonly [number, number, number];
  /** Uniform size; 1 is the hero portal. */
  scale?: number;
  /** Frame and ring colour. */
  frameColour: string;
  crystalColour: string;
  /** Adds the 3D crown above the crystal: the team lead's portal. */
  crowned?: boolean;
}

/**
 * The world's signature object: a glowing doorway with a faceted crystal inside, circled by
 * orbit rings and a ring of tick marks. Used large for the hero and smaller for each member.
 * All motion is ref mutation in the frame loop, never React state.
 */
export function Portal({
  position,
  scale = 1,
  frameColour,
  crystalColour,
  crowned = false,
}: PortalProps) {
  const frameGlow = useFrameGlow();
  const paneFill = usePaneFill();
  const crystal = useRef<Mesh>(null);
  const orbits = useRef<Group>(null);
  const ticks = useRef<InstancedMesh>(null);

  // Tick marks laid out once around a circle; every sixth is longer, like a dial.
  useLayoutEffect(() => {
    const mesh = ticks.current;
    if (!mesh) return;
    const dummy = new Object3D();
    for (let index = 0; index < TICK_COUNT; index++) {
      const angle = (index / TICK_COUNT) * Math.PI * 2;
      const length = index % 6 === 0 ? 0.22 : 0.1;
      dummy.position.set(Math.cos(angle) * 2.55, 0, Math.sin(angle) * 2.55);
      dummy.scale.set(0.012, length, 0.012);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }, delta) => {
    if (crystal.current) {
      crystal.current.rotation.y += delta * 0.35;
      crystal.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.25;
      // Gentle levitation.
      crystal.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.08;
    }
    if (orbits.current) orbits.current.rotation.y += delta * 0.12;
    if (ticks.current) ticks.current.rotation.y -= delta * 0.05;
  });

  const halfWidth = PORTAL_WIDTH / 2;
  const halfHeight = PORTAL_HEIGHT / 2;

  return (
    <group position={position} scale={scale}>
      {/* Frame: four thin bars. */}
      {[
        {
          at: [0, halfHeight, 0],
          size: [PORTAL_WIDTH + FRAME_THICKNESS, FRAME_THICKNESS, FRAME_THICKNESS],
        },
        {
          at: [0, -halfHeight, 0],
          size: [PORTAL_WIDTH + FRAME_THICKNESS, FRAME_THICKNESS, FRAME_THICKNESS],
        },
        { at: [-halfWidth, 0, 0], size: [FRAME_THICKNESS, PORTAL_HEIGHT, FRAME_THICKNESS] },
        { at: [halfWidth, 0, 0], size: [FRAME_THICKNESS, PORTAL_HEIGHT, FRAME_THICKNESS] },
      ].map(({ at, size }) => (
        <mesh key={at.join()} position={at as [number, number, number]}>
          <boxGeometry args={size as [number, number, number]} />
          <meshBasicMaterial color={frameColour} toneMapped={false} />
        </mesh>
      ))}

      {/* Bloom without post-processing: a blurred outline texture on a plane just behind. */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry
          args={[PORTAL_WIDTH + PORTAL_GLOW_PADDING, PORTAL_HEIGHT + PORTAL_GLOW_PADDING]}
        />
        <meshBasicMaterial
          map={frameGlow}
          color={frameColour}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* The dark-blue pane filling the doorway. */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[PORTAL_WIDTH, PORTAL_HEIGHT]} />
        <meshBasicMaterial
          map={paneFill}
          color="#16206b"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={crystal} position={[0, 0, 0.6]}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color={crystalColour}
          emissive={crystalColour}
          emissiveIntensity={0.2}
          metalness={0.25}
          roughness={0.3}
          flatShading
        />
      </mesh>

      {/* The bright equatorial band around the crystal. */}
      <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2 - 0.12, 0.1, 0]}>
        <torusGeometry args={[1.02, 0.018, 8, 96]} />
        <meshBasicMaterial color="#c9d0ff" toneMapped={false} />
      </mesh>

      <group ref={orbits} position={[0, 0, 0.6]}>
        <mesh rotation={[1.25, 0, 0.2]}>
          <torusGeometry args={[2.1, 0.008, 6, 160]} />
          <meshBasicMaterial color="#f2f1ea" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[0.2, 0.5, 1.4]}>
          <torusGeometry args={[2.35, 0.006, 6, 160]} />
          <meshBasicMaterial color={frameColour} transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.005, 6, 160]} />
          <meshBasicMaterial color="#7b8cff" transparent opacity={0.4} />
        </mesh>
      </group>

      <instancedMesh
        ref={ticks}
        args={[undefined, undefined, TICK_COUNT]}
        position={[0, -0.1, 0.6]}
        rotation={[0.18, 0, 0]}
      >
        <boxGeometry />
        <meshBasicMaterial color="#c9d0ff" transparent opacity={0.7} />
      </instancedMesh>

      {crowned && <Crown position={[0, 1.55, 0.6]} />}
    </group>
  );
}

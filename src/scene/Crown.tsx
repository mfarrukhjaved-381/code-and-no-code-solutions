import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

const GOLD = '#f2c35b';
const POINT_COUNT = 5;
const RADIUS = 0.34;

/**
 * A small golden crown that turns above the team lead's crystal: five spikes on a band. Built
 * from primitives, so it costs no model download.
 */
export function Crown({ position }: { position: readonly [number, number, number] }) {
  const crown = useRef<Group>(null);

  useFrame((_, delta) => {
    if (crown.current) crown.current.rotation.y += delta * 0.6;
  });

  return (
    <group ref={crown} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS, 0.035, 10, 48]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {Array.from({ length: POINT_COUNT }, (_, index) => {
        const angle = (index / POINT_COUNT) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * RADIUS, 0.16, Math.sin(angle) * RADIUS]}>
            <coneGeometry args={[0.07, 0.3, 8]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.35}
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}

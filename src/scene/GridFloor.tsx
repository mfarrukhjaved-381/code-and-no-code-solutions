import { useMemo } from 'react';
import { Color } from 'three';
import { useRadialGlow } from './textures';
import { FLOOR_Y, heroPortalPosition } from './worldLayout';

const vertexShader = /* glsl */ `
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uCell;
  varying vec3 vWorld;

  void main() {
    // Anti-aliased grid lines: distance to the nearest line, measured in screen pixels.
    vec2 coord = vWorld.xz / uCell;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);
    // Fade with distance from the camera, so the floor dissolves into the dark instead of ending.
    float fade = 1.0 - smoothstep(8.0, 60.0, distance(vWorld.xz, cameraPosition.xz));
    gl_FragColor = vec4(uColor, line * fade * 0.5);
  }
`;

/**
 * The endless-looking blue grid the world stands on, drawn by one shader on one plane, plus a
 * soft pool of light under the hero portal.
 */
export function GridFloor() {
  const glow = useRadialGlow();
  const uniforms = useMemo(
    () => ({ uColor: { value: new Color('#5d6dff') }, uCell: { value: 1.6 } }),
    [],
  );

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -40]}>
        <planeGeometry args={[220, 220]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[heroPortalPosition.x, FLOOR_Y + 0.01, heroPortalPosition.z]}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          map={glow}
          color="#4b57d6"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

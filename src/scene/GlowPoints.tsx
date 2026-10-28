import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, type Points, type ShaderMaterial } from 'three';

const vertexShader = /* glsl */ `
  attribute float size;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uDrift;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = color;
    // Per-point phase from its position, so neighbours twinkle and drift out of step.
    float phase = position.x * 12.9 + position.z * 7.1;
    vTwinkle = 0.7 + 0.3 * sin(uTime * 1.6 + phase);
    vec3 moved = position;
    moved.y += sin(uTime * 0.4 + position.x * 0.7 + position.z * 0.3) * uDrift;
    vec4 viewPosition = modelViewMatrix * vec4(moved, 1.0);
    // Perspective size attenuation: nearer points draw larger.
    gl_PointSize = size * uPixelRatio * (90.0 / -viewPosition.z);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Soft round sprite computed in the shader, so no texture is downloaded or sampled.
    float falloff = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(vColor, falloff * falloff * vTwinkle);
  }
`;

/** Props for {@link GlowPoints}. All buffers are flat, GPU-ready arrays of equal point count. */
export interface GlowPointsProps {
  positions: Float32Array;
  colours: Float32Array;
  sizes: Float32Array;
  /** Vertical bob amplitude in world units; 0 keeps points still. */
  drift?: number;
  /** Rotation speed around the local y axis, in radians per second. */
  spin?: number;
}

/**
 * A field of soft, twinkling light points drawn in a single draw call, whatever the count.
 * Shared by the galaxy, the dust and the pillar tips. Animation runs in the shader from one
 * time uniform; the CPU does no per-point work after creation.
 */
export function GlowPoints({ positions, colours, sizes, drift = 0, spin = 0 }: GlowPointsProps) {
  const points = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);
  const pixelRatio = useThree((state) => state.viewport.dpr);
  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: pixelRatio },
      uTime: { value: 0 },
      uDrift: { value: drift },
    }),
    [pixelRatio, drift],
  );

  useFrame(({ clock }, delta) => {
    // Written through the material the renderer owns, not the memoised object React owns.
    const time = material.current?.uniforms.uTime;
    if (time) time.value = clock.elapsedTime;
    if (points.current && spin !== 0) points.current.rotation.y += delta * spin;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colours, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexColors
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

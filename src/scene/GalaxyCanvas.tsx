/**
 * Entry point of the lazily loaded 3D chunk (see `app/GalaxyLayer`). Everything three.js-related
 * is reachable only from here, which keeps it out of the initial bundle.
 */
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import type { QualityTier } from '../app/capabilities';
import { team } from '../content/team';
import { CameraRig } from './CameraRig';
import { FrameGuard } from './FrameGuard';
import { GridFloor } from './GridFloor';
import { Pillars } from './Pillars';
import { Portal } from './Portal';
import { Sky } from './Sky';
import { useStagedMount } from './useStagedMount';
import { cameraKeyframes, heroPortalPosition, stationPositions } from './worldLayout';

/** Slowest acceptable median frame per tier: 45 fps keeps full quality, 30 fps keeps the 3D at all. */
const MAX_FRAME_SECONDS: Record<QualityTier, number> = { full: 1 / 45, lite: 1 / 30 };
/**
 * Layers after the first view, in mount order: the pillars, then the sky, then the member
 * portals, which are only seen after scrolling. The floor and hero portal mount immediately.
 */
const STAGE = { pillars: 1, sky: 2, stations: 3 } as const;

const POINT_COUNTS: Record<QualityTier, { galaxy: number; dust: number }> = {
  full: { galaxy: 30000, dust: 6000 },
  lite: { galaxy: 10000, dust: 2500 },
};
/** Device pixel ratio range. Capped below the screen's native ratio: rendering at 3x on a laptop
 * GPU costs far more than the sharpness it buys on soft, glowing geometry. */
const PIXEL_RATIO: Record<QualityTier, [number, number]> = { full: [1, 1.5], lite: [1, 1] };

/** Matches `--color-space`, so fogged objects dissolve into the page background exactly. */
const SPACE = '#020308';
const LEAD_GOLD = '#f2c35b';
const MEMBER_FRAME_COLOURS = ['#9a86ff', '#7b8cff'] as const;

const initialPosition = cameraKeyframes[0]?.position.toArray();

/** Props for {@link GalaxyCanvas}. */
interface GalaxyCanvasProps {
  tier: QualityTier;
  /** Called when the measured frame rate is too low for `tier`. */
  onSlow: () => void;
}

/**
 * The full-screen 3D world behind the page. Fades in after its first frame, so it never pops,
 * and mounts its layers progressively so no single task blocks the page.
 */
export default function GalaxyCanvas({ tier, onSlow }: GalaxyCanvasProps) {
  const [isReady, setIsReady] = useState(false);
  const stage = useStagedMount(STAGE.stations);
  const counts = POINT_COUNTS[tier];

  return (
    <div
      aria-hidden="true"
      data-testid="galaxy-canvas"
      // Exposes the active quality tier to tests and to anyone inspecting a slow device.
      data-tier={tier}
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-[1600ms] ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Canvas
        dpr={PIXEL_RATIO[tier]}
        // Antialiasing is wasted on glow and points and costs fill rate on every frame.
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 50, near: 0.1, far: 400, position: initialPosition }}
        onCreated={() => {
          setIsReady(true);
        }}
      >
        <fog attach="fog" args={[SPACE, 14, 70]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[-4, 6, 5]} intensity={1.6} />
        <pointLight position={[0, 0.6, 2.2]} color="#6f7dff" intensity={14} distance={9} />

        <GridFloor />
        <Portal
          position={heroPortalPosition.toArray()}
          frameColour="#f2f1ea"
          crystalColour="#7f86ff"
        />
        {stage >= STAGE.pillars && <Pillars />}
        {stage >= STAGE.sky && <Sky galaxyCount={counts.galaxy} dustCount={counts.dust} />}
        {stage >= STAGE.stations &&
          team.map((member, index) => {
            const station = stationPositions[index];
            if (!station) return null;
            const isLead = member.rank === 'lead';
            const frameColour = isLead
              ? LEAD_GOLD
              : (MEMBER_FRAME_COLOURS[index % MEMBER_FRAME_COLOURS.length] ?? '#9a86ff');
            return (
              <Portal
                key={member.id}
                position={station.toArray()}
                scale={0.62}
                frameColour={frameColour}
                crystalColour={isLead ? '#e9b949' : frameColour}
                crowned={isLead}
              />
            );
          })}
        <CameraRig />
        {/* Keyed by tier so it measures again from scratch after a downgrade. */}
        <FrameGuard key={tier} maxFrameSeconds={MAX_FRAME_SECONDS[tier]} onSlow={onSlow} />
      </Canvas>
    </div>
  );
}

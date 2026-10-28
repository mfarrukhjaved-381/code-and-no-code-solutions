/**
 * Glow and fill textures drawn in code on small canvases.
 *
 * Generating them means the 3D world downloads no image files at all. Each hook creates its
 * texture once per component and disposes it on unmount: textures created outside JSX are not
 * cleaned up by React Three Fiber automatically, and leaked GPU memory never comes back.
 */
import { useEffect, useMemo } from 'react';
import { CanvasTexture } from 'three';

/** Portal frame proportions shared by every portal; the frame glow texture is drawn to match. */
export const PORTAL_WIDTH = 3.2;
export const PORTAL_HEIGHT = 4.4;
/** Extra size around the frame that the glow plane covers. */
export const PORTAL_GLOW_PADDING = 1.6;

function drawTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context) draw(context);
  return new CanvasTexture(canvas);
}

/** Soft round light, for halos and floor glows. */
function createRadialGlow(): CanvasTexture {
  return drawTexture(128, 128, (context) => {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  });
}

/** A blurred rectangle outline sized so it hugs a portal frame on a padded plane. */
function createFrameGlow(): CanvasTexture {
  const width = 256;
  const height = Math.round(
    (width * (PORTAL_HEIGHT + PORTAL_GLOW_PADDING)) / (PORTAL_WIDTH + PORTAL_GLOW_PADDING),
  );
  const inset = (width * (PORTAL_GLOW_PADDING / 2)) / (PORTAL_WIDTH + PORTAL_GLOW_PADDING);
  return drawTexture(width, height, (context) => {
    context.shadowColor = 'white';
    context.shadowBlur = 28;
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    // Stroked twice: one pass is too faint once the blur spreads it.
    for (let pass = 0; pass < 2; pass++) {
      context.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
    }
  });
}

/** Vertical fade for the portal's inner pane: deep at the top, lighter toward the floor. */
function createPaneFill(): CanvasTexture {
  return drawTexture(4, 128, (context) => {
    const gradient = context.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(0, 'rgba(255,255,255,0.25)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.7)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 4, 128);
  });
}

function useDisposable<T extends { dispose: () => void }>(resource: T): T {
  useEffect(
    () => () => {
      resource.dispose();
    },
    [resource],
  );
  return resource;
}

export function useRadialGlow(): CanvasTexture {
  return useDisposable(useMemo(() => createRadialGlow(), []));
}

export function useFrameGlow(): CanvasTexture {
  return useDisposable(useMemo(() => createFrameGlow(), []));
}

export function usePaneFill(): CanvasTexture {
  return useDisposable(useMemo(() => createPaneFill(), []));
}

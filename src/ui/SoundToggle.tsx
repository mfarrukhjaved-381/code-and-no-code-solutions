import { useState } from 'react';
import { setSoundEnabled } from '../app/ambientSound';

const BARS = ['h-2', 'h-3', 'h-1.5', 'h-3.5'] as const;
const BAR_DELAYS = [
  '',
  '[animation-delay:-0.3s]',
  '[animation-delay:-0.6s]',
  '[animation-delay:-0.15s]',
] as const;

/**
 * Header switch for the ambient sound. Off by default: browsers block audio that starts without
 * a gesture, and unexpected sound is hostile. The bars animate only while sound plays.
 */
export function SoundToggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={isOn}
      data-testid="sound-toggle"
      onClick={() => {
        setSoundEnabled(!isOn);
        setIsOn(!isOn);
      }}
      className="label-mono flex items-center gap-3 text-ink-muted transition-colors hover:text-ink"
    >
      <span aria-hidden="true" className="flex h-3.5 items-end gap-0.5">
        {BARS.map((height, index) => (
          <span
            key={height + String(index)}
            className={`w-0.5 origin-bottom bg-current ${height} ${
              isOn ? `motion-safe:animate-equalizer ${BAR_DELAYS[index] ?? ''}` : 'scale-y-30'
            }`}
          />
        ))}
      </span>
      Sound {isOn ? 'on' : 'off'}
    </button>
  );
}

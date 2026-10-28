/**
 * The site's sound: an ambient space drone and short interface blips, synthesised live with the
 * Web Audio API.
 *
 * Synthesised rather than recorded so the site downloads no audio files; the whole soundscape is
 * a few oscillators and a filter. Nothing is created until the visitor turns sound on, because
 * browsers only allow audio to start from a user gesture and an idle AudioContext still costs
 * CPU.
 */

interface AudioGraph {
  context: AudioContext;
  master: GainNode;
}

const DRONE_VOLUME = 0.16;
const FADE_SECONDS = 0.6;

let graph: AudioGraph | null = null;
let enabled = false;
let suspendTimer: number | undefined;

/** Builds the drone: detuned low tones through a slowly breathing low-pass filter. */
function buildGraph(): AudioGraph {
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 420;
  filter.Q.value = 0.8;
  filter.connect(master);

  // A root (A1) with its fifth and octaves; small detunes make the tones beat slowly against
  // each other, which is what gives a pad its sense of motion.
  const voices: readonly (readonly [frequency: number, detune: number])[] = [
    [55, -6],
    [82.41, 5],
    [110, 3],
    [164.81, -4],
  ];
  for (const [frequency, detune] of voices) {
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    const voiceGain = context.createGain();
    voiceGain.gain.value = 0.12;
    oscillator.connect(voiceGain).connect(filter);
    oscillator.start();
  }

  // A very slow LFO sweeps the filter cutoff, so the drone opens and closes like breathing.
  const lfo = context.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoDepth = context.createGain();
  lfoDepth.gain.value = 180;
  lfo.connect(lfoDepth).connect(filter.frequency);
  lfo.start();

  return { context, master };
}

/** Whether sound is currently on. */
export function isSoundEnabled(): boolean {
  return enabled;
}

/**
 * Fades the ambient drone in or out. Must first be called from a user gesture (a click), or the
 * browser keeps the audio context suspended.
 */
export function setSoundEnabled(on: boolean): void {
  enabled = on;
  graph ??= buildGraph();
  const { context, master } = graph;
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setTargetAtTime(on ? DRONE_VOLUME : 0, now, FADE_SECONDS);

  window.clearTimeout(suspendTimer);
  if (on) {
    void context.resume();
  } else {
    // Suspend once the fade has finished, so a muted site uses no audio processing at all.
    suspendTimer = window.setTimeout(() => {
      void context.suspend();
    }, FADE_SECONDS * 5000);
  }
}

/** A short soft tone for hovering interactive elements. Silent unless sound is on. */
export function playBlip(): void {
  if (!enabled || !graph) return;
  const { context } = graph;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1180, now);
  oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.08);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  oscillator.connect(envelope).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.13);
}

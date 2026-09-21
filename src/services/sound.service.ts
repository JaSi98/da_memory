/** Shared audio context, created on first use. */
let context: AudioContext | null = null;

/**
 * Returns the shared audio context and creates it on first use.
 * @returns The audio context.
 */
function getContext(): AudioContext {
  if (!context) context = new AudioContext();
  return context;
}

/**
 * Fades a tone in and out to avoid clicking artifacts.
 * @param gain - Gain node to shape.
 * @param start - Start time on the audio clock in seconds.
 * @param duration - Length of the tone in seconds.
 */
function applyEnvelope(gain: GainNode, start: number, duration: number): void {
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.18, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
}

/**
 * Plays a soft tone through a low pass filter.
 * @param frequency - Pitch in Hertz.
 * @param duration - Length in seconds.
 * @param delay - Delay before the tone starts in seconds.
 * @param type - Oscillator waveform.
 */
function playTone(frequency: number, duration: number, delay = 0, type: OscillatorType = 'triangle'): void {
  const ctx = getContext();
  const start = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  filter.type = 'lowpass';
  filter.frequency.value = 2200;
  applyEnvelope(gain, start, duration);
  oscillator.connect(filter).connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

/**
 * Plays a short soft click when a card is revealed.
 */
export function playFlip(): void {
  playTone(700, 0.07, 0, 'sine');
}

/**
 * Plays a friendly chord when a pair is found.
 */
export function playMatch(): void {
  playTone(523, 0.18);
  playTone(659, 0.18, 0.06);
  playTone(784, 0.22, 0.12);
}

/**
 * Plays a gentle falling two-note sound for a wrong pair.
 */
export function playMismatch(): void {
  playTone(311, 0.16, 0, 'sine');
  playTone(233, 0.2, 0.1, 'sine');
}

/**
 * Plays a small fanfare when a player wins.
 */
export function playWin(): void {
  playTone(523, 0.16);
  playTone(659, 0.16, 0.14);
  playTone(784, 0.16, 0.28);
  playTone(1047, 0.35, 0.42);
}

/**
 * Plays a calm double tone for a draw.
 */
export function playDraw(): void {
  playTone(349, 0.3, 0, 'sine');
  playTone(311, 0.35, 0.25, 'sine');
}

/**
 * Plays a short bang with a bright sparkle for a firework.
 */
export function playPop(): void {
  playTone(196, 0.14, 0, 'sine');
  playTone(1320, 0.08, 0.02);
}

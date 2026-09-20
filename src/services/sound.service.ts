let context: AudioContext | null = null;

function getContext(): AudioContext {
  if (!context) context = new AudioContext();
  return context;
}

/** Blendet eine Tonhoehe weich ein und wieder aus (vermeidet Klick-Artefakte). */
function applyEnvelope(gain: GainNode, start: number, duration: number): void {
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.18, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
}

/** Spielt einen weichen Ton mit Tiefpassfilter zu einem bestimmten Zeitpunkt. */
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

/** Spielt einen kurzen, weichen Klick beim Aufdecken einer Karte. */
export function playFlip(): void {
  playTone(700, 0.07, 0, 'sine');
}

/** Spielt einen freundlichen Durakkord bei einem gefundenen Paar. */
export function playMatch(): void {
  playTone(523, 0.18);
  playTone(659, 0.18, 0.06);
  playTone(784, 0.22, 0.12);
}

/** Spielt einen sanften, absteigenden Zweiklang bei einem nicht passenden Paar. */
export function playMismatch(): void {
  playTone(311, 0.16, 0, 'sine');
  playTone(233, 0.2, 0.1, 'sine');
}

/** Spielt eine kleine Fanfare, wenn ein Spieler gewinnt. */
export function playWin(): void {
  playTone(523, 0.16);
  playTone(659, 0.16, 0.14);
  playTone(784, 0.16, 0.28);
  playTone(1047, 0.35, 0.42);
}

/** Spielt einen ruhigen, neutralen Doppelton bei einem Unentschieden. */
export function playDraw(): void {
  playTone(349, 0.3, 0, 'sine');
  playTone(311, 0.35, 0.25, 'sine');
}

/** Spielt einen kurzen Knall mit hellem Funkeln fuer ein Feuerwerk. */
export function playPop(): void {
  playTone(196, 0.14, 0, 'sine');
  playTone(1320, 0.08, 0.02);
}

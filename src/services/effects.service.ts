import type { ThemeId } from '../models/theme.model';
import { playPop } from './sound.service';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  gravity: number;
  color: string;
  rotation: number;
  spin: number;
  glyph?: string;
}

interface EffectTheme {
  colors: string[];
  glyphs: string[];
  glow: boolean;
}

const EFFECT_THEMES: Record<ThemeId, EffectTheme> = {
  'code-vibes': { colors: ['#4dd5bc', '#f0ea6e', '#2bb1ff', '#f58e39', '#ffffff'], glyphs: ['</>', '{ }', '=>', '&&', ';'], glow: true },
  gaming: { colors: ['#ed1b76', '#f0ea6e', '#1faafc', '#7cff6b', '#ffffff'], glyphs: ['★', '♦', '✦', '●'], glow: true },
  'da-projects': { colors: ['#bfe5f2', '#f0ea6e', '#ffffff', '#fa5a5a', '#f58e39'], glyphs: [], glow: true },
  foods: { colors: ['#f3832d', '#a45212', '#ed1b76', '#f0ea6e', '#5fbf7a'], glyphs: ['🍔', '🍕', '🍩', '🍟', '🍦', '🧁', '🌮'], glow: false },
};

const GRAVITY = 0.16;
const FIREWORK_INTERVAL_MS = 650;
const SPARKS_PER_BURST = 64;

let particles: Particle[] = [];
let timers: number[] = [];
let frameId = 0;

const random = (min: number, max: number): number => min + Math.random() * (max - min);
const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

function baseParticle(x: number, y: number, color: string): Particle {
  return { x, y, vx: 0, vy: 0, size: 4, life: 1, decay: 0.012, gravity: GRAVITY, color, rotation: 0, spin: 0 };
}

/** Ein Funke eines Feuerwerks: fliegt radial nach aussen und verglueht. */
function spark(x: number, y: number, color: string): Particle {
  const angle = random(0, Math.PI * 2);
  const speed = random(1.5, 7.5);
  return { ...baseParticle(x, y, color), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: random(1.5, 3.2), decay: random(0.009, 0.018) };
}

/** Ein Konfettiteil (Rechteck oder Themen-Glyphe) mit Startgeschwindigkeit. */
function confetto(x: number, y: number, vx: number, vy: number, theme: EffectTheme): Particle {
  const glyph = theme.glyphs.length > 0 && Math.random() < 0.55 ? pick(theme.glyphs) : undefined;
  return { ...baseParticle(x, y, pick(theme.colors)), vx, vy, size: random(8, 15), decay: 0.004, glyph, rotation: random(0, 6), spin: random(-0.2, 0.2) };
}

function fireworkBurst(theme: EffectTheme): void {
  const x = random(window.innerWidth * 0.15, window.innerWidth * 0.85);
  const y = random(window.innerHeight * 0.12, window.innerHeight * 0.5);
  const color = pick(theme.colors);
  for (let i = 0; i < SPARKS_PER_BURST; i++) particles.push(spark(x, y, i % 5 === 0 ? pick(theme.colors) : color));
  playPop();
}

/** Zwei Konfetti-Kanonen aus den unteren Ecken schiessen schraeg nach oben. */
function cannons(theme: EffectTheme): void {
  for (const side of [-1, 1]) {
    const x = side < 0 ? 0 : window.innerWidth;
    for (let i = 0; i < 70; i++) {
      const power = random(10, 17);
      particles.push(confetto(x, window.innerHeight, -side * power * random(0.25, 0.75), -power * random(0.6, 1), theme));
    }
  }
}

function rainDrop(theme: EffectTheme): void {
  particles.push(confetto(random(0, window.innerWidth), -20, random(-1, 1), random(1.5, 3.5), theme));
}

function move(p: Particle): void {
  p.x += p.vx;
  p.y += p.vy;
  p.vy += p.gravity;
  p.vx *= 0.985;
  p.life -= p.decay;
  p.rotation += p.spin;
}

function drawConfetto(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  if (p.glyph) {
    ctx.font = `${p.size * 1.6}px sans-serif`;
    ctx.fillText(p.glyph, 0, 0);
  } else {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  }
}

function draw(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
  ctx.fillStyle = p.color;
  if (p.spin === 0) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  } else {
    drawConfetto(ctx, p);
  }
  ctx.restore();
}

function loop(canvas: HTMLCanvasElement, theme: EffectTheme): void {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = theme.glow ? 'lighter' : 'source-over';
  particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 60);
  for (const p of particles) {
    move(p);
    draw(ctx, p);
  }
  if (canvas.isConnected) frameId = requestAnimationFrame(() => loop(canvas, theme));
}

/** Stoppt alle laufenden Effekte und raeumt auf. */
export function stopEffects(): void {
  timers.forEach((id) => window.clearInterval(id));
  timers = [];
  cancelAnimationFrame(frameId);
  particles = [];
}

/** Startet Konfetti-Kanonen, Konfettiregen und Feuerwerk passend zum Theme. */
export function celebrate(canvas: HTMLCanvasElement, themeId: ThemeId, durationMs = 9000): void {
  const theme = EFFECT_THEMES[themeId];
  stopEffects();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  loop(canvas, theme);
  cannons(theme);
  fireworkBurst(theme);
  timers.push(window.setInterval(() => fireworkBurst(theme), FIREWORK_INTERVAL_MS));
  timers.push(window.setInterval(() => rainDrop(theme), 90));
  window.setTimeout(() => timers.forEach((id) => window.clearInterval(id)), durationMs);
}

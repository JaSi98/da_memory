import type { ThemeId } from '../models/theme.model';
import { playPop } from './sound.service';

/**
 * A single particle of a firework or of the confetti.
 */
interface Particle {
  /** Horizontal position in pixels. */
  x: number;
  /** Vertical position in pixels. */
  y: number;
  /** Horizontal speed in pixels per frame. */
  vx: number;
  /** Vertical speed in pixels per frame. */
  vy: number;
  /** Radius of a spark or edge length of a confetti piece. */
  size: number;
  /** Remaining life from 1 (new) to 0 (gone); it also controls the opacity. */
  life: number;
  /** How much life is lost per frame. */
  decay: number;
  /** Downward acceleration per frame. */
  gravity: number;
  /** CSS color of the particle. */
  color: string;
  /** Current rotation in radians. */
  rotation: number;
  /** Rotation speed in radians per frame; 0 marks a spark. */
  spin: number;
  /** Optional text glyph that is drawn instead of a rectangle. */
  glyph?: string;
  /** Optional sticker image that is drawn instead of a rectangle. */
  image?: HTMLImageElement;
}

/**
 * Look of the celebration effects of one theme.
 */
interface EffectTheme {
  /** CSS colors used for sparks and confetti. */
  colors: string[];
  /** Plain text glyphs that are mixed into the confetti. */
  glyphs: string[];
  /** File names of motifs that are mixed into the confetti as stickers. */
  sprites: string[];
  /** True if particles are blended additively, which suits dark backgrounds. */
  glow: boolean;
}

/** Colors, glyphs and stickers of the celebration effects per theme. */
const EFFECT_THEMES: Record<ThemeId, EffectTheme> = {
  'code-vibes': { colors: ['#4dd5bc', '#f0ea6e', '#2bb1ff', '#f58e39', '#ffffff'], glyphs: ['</>', '{ }', '=>', '&&', ';'], sprites: [], glow: true },
  gaming: { colors: ['#ed1b76', '#f0ea6e', '#1faafc', '#7cff6b', '#ffffff'], glyphs: ['*', '+', '#', 'o'], sprites: [], glow: true },
  'da-projects': { colors: ['#bfe5f2', '#f0ea6e', '#ffffff', '#fa5a5a', '#f58e39'], glyphs: [], sprites: [], glow: true },
  foods: { colors: ['#f3832d', '#a45212', '#ed1b76', '#f0ea6e', '#5fbf7a'], glyphs: [], sprites: ['fries', 'pizza', 'donut', 'ice-cream', 'cupcake', 'taco', 'burger', 'sushi', 'macarons'], glow: false },
};

/** Downward acceleration of a particle per frame. */
const GRAVITY = 0.16;
/** Time between two firework explosions in milliseconds. */
const FIREWORK_INTERVAL_MS = 650;
/** Number of sparks in one firework explosion. */
const SPARKS_PER_BURST = 64;

/** All particles that are currently alive. */
let particles: Particle[] = [];
/** Ids of the running intervals for fireworks and confetti rain. */
let timers: number[] = [];
/** Id of the pending animation frame. */
let frameId = 0;
/** Loaded sticker images of the current theme. */
let sprites: HTMLImageElement[] = [];

/**
 * Returns a random number within a range.
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (exclusive).
 * @returns A random number between min and max.
 */
const random = (min: number, max: number): number => min + Math.random() * (max - min);
/**
 * Picks a random element of an array.
 * @typeParam T - Type of the array elements.
 * @param items - Array to pick from; it must not be empty.
 * @returns A random element.
 */
const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

/**
 * Creates a particle with default values.
 * @param x - Start position, horizontal.
 * @param y - Start position, vertical.
 * @param color - CSS color of the particle.
 * @returns A new particle.
 */
function baseParticle(x: number, y: number, color: string): Particle {
  return { x, y, vx: 0, vy: 0, size: 4, life: 1, decay: 0.012, gravity: GRAVITY, color, rotation: 0, spin: 0 };
}

/**
 * Creates one spark of a firework that flies outward and fades.
 * @param x - Center of the explosion, horizontal.
 * @param y - Center of the explosion, vertical.
 * @param color - CSS color of the spark.
 * @returns A new spark particle.
 */
function spark(x: number, y: number, color: string): Particle {
  const angle = random(0, Math.PI * 2);
  const speed = random(1.5, 7.5);
  return { ...baseParticle(x, y, color), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: random(1.5, 3.2), decay: random(0.009, 0.018) };
}

/**
 * Creates one piece of confetti: a rectangle, a theme glyph or a theme sticker.
 * @param x - Start position, horizontal.
 * @param y - Start position, vertical.
 * @param vx - Initial horizontal speed.
 * @param vy - Initial vertical speed.
 * @param theme - Effect settings of the current theme.
 * @returns A new confetti particle.
 */
function confetto(x: number, y: number, vx: number, vy: number, theme: EffectTheme): Particle {
  const useShape = Math.random() < 0.55;
  const glyph = useShape && theme.glyphs.length > 0 ? pick(theme.glyphs) : undefined;
  const image = useShape && sprites.length > 0 ? pick(sprites) : undefined;
  return { ...baseParticle(x, y, pick(theme.colors)), vx, vy, size: random(8, 15), decay: 0.004, glyph, image, rotation: random(0, 6), spin: random(-0.2, 0.2) };
}

/**
 * Loads a motif image that is used as confetti sticker.
 * @param themeId - Theme the motif belongs to.
 * @param name - File name of the motif without extension.
 * @returns The image element.
 */
function loadSprite(themeId: ThemeId, name: string): HTMLImageElement {
  const image = new Image();
  image.src = `./images/${themeId}/${name}.svg`;
  return image;
}

/**
 * Launches one firework explosion at a random position in the upper screen half.
 * @param theme - Effect settings of the current theme.
 */
function fireworkBurst(theme: EffectTheme): void {
  const x = random(window.innerWidth * 0.15, window.innerWidth * 0.85);
  const y = random(window.innerHeight * 0.12, window.innerHeight * 0.5);
  const color = pick(theme.colors);
  for (let i = 0; i < SPARKS_PER_BURST; i++) particles.push(spark(x, y, i % 5 === 0 ? pick(theme.colors) : color));
  playPop();
}

/**
 * Shoots confetti from both bottom corners diagonally upward.
 * @param theme - Effect settings of the current theme.
 */
function cannons(theme: EffectTheme): void {
  for (const side of [-1, 1]) {
    const x = side < 0 ? 0 : window.innerWidth;
    for (let i = 0; i < 70; i++) {
      const power = random(10, 17);
      particles.push(confetto(x, window.innerHeight, -side * power * random(0.25, 0.75), -power * random(0.6, 1), theme));
    }
  }
}

/**
 * Lets one piece of confetti fall from the top edge.
 * @param theme - Effect settings of the current theme.
 */
function rainDrop(theme: EffectTheme): void {
  particles.push(confetto(random(0, window.innerWidth), -20, random(-1, 1), random(1.5, 3.5), theme));
}

/**
 * Advances a particle by one frame (position, gravity, drag, fading).
 * @param p - Particle to update.
 */
function move(p: Particle): void {
  p.x += p.vx;
  p.y += p.vy;
  p.vy += p.gravity;
  p.vx *= 0.985;
  p.life -= p.decay;
  p.rotation += p.spin;
}

/**
 * Draws a confetti particle as sticker, glyph or small rectangle.
 * @param ctx - Drawing context of the canvas.
 * @param p - Particle to draw.
 */
function drawConfetto(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  if (p.image) {
    ctx.drawImage(p.image, -p.size * 1.3, -p.size * 1.3, p.size * 2.6, p.size * 2.6);
  } else if (p.glyph) {
    ctx.font = `${p.size * 1.6}px sans-serif`;
    ctx.fillText(p.glyph, 0, 0);
  } else {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  }
}

/**
 * Draws a particle: sparks as circles, confetti through drawConfetto.
 * @param ctx - Drawing context of the canvas.
 * @param p - Particle to draw.
 */
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

/**
 * Runs one animation frame and schedules the next one while the canvas is on the page.
 * @param canvas - Canvas the effects are drawn on.
 * @param theme - Effect settings of the current theme.
 */
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

/**
 * Stops all running effects and clears the particles.
 */
export function stopEffects(): void {
  timers.forEach((id) => window.clearInterval(id));
  timers = [];
  cancelAnimationFrame(frameId);
  particles = [];
}

/**
 * Starts confetti cannons, confetti rain and fireworks for a theme.
 * @param canvas - Canvas covering the screen.
 * @param themeId - Theme that decides colors and shapes.
 * @param durationMs - How long new fireworks and confetti keep appearing, in milliseconds.
 */
export function celebrate(canvas: HTMLCanvasElement, themeId: ThemeId, durationMs = 9000): void {
  const theme = EFFECT_THEMES[themeId];
  stopEffects();
  sprites = theme.sprites.map((name) => loadSprite(themeId, name));
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  loop(canvas, theme);
  cannons(theme);
  fireworkBurst(theme);
  timers.push(window.setInterval(() => fireworkBurst(theme), FIREWORK_INTERVAL_MS));
  timers.push(window.setInterval(() => rainDrop(theme), 90));
  window.setTimeout(() => timers.forEach((id) => window.clearInterval(id)), durationMs);
}

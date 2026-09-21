import type { PlayerColor, ThemeId } from '../models/theme.model';
import { PLAYER_LABELS } from '../config/player.config';
import { celebrate, stopEffects } from '../services/effects.service';
import { playWin, playDraw } from '../services/sound.service';

/** Final or current score per player color. */
type Scores = Partial<Record<PlayerColor, number>>;

/** How long the game over panel is shown before the result appears, in milliseconds. */
const RESULT_DELAY_MS = 1700;
/** Label of the button that leaves the end screen, per theme. */
const RESTART_LABELS: Record<ThemeId, string> = {
  'code-vibes': 'Back to start',
  gaming: 'Home',
  'da-projects': 'Home',
  foods: 'Home',
};

/**
 * Finds the player or players with the highest score.
 * @param scores - Final score per player.
 * @returns All players sharing the top score; more than one means a draw.
 */
function findLeaders(scores: Scores): PlayerColor[] {
  const entries = Object.entries(scores) as [PlayerColor, number][];
  const topScore = Math.max(...entries.map(([, points]) => points));
  return entries.filter(([, points]) => points === topScore).map(([player]) => player);
}

/**
 * Builds the game over heading: original artwork for Code vibes, a yellow sign for the other themes.
 * @param theme - Theme of the finished game.
 * @returns HTML markup of the heading.
 */
function titleTemplate(theme: ThemeId): string {
  const art = '<img class="endscreen__title-art" src="./images/end/game-over.svg" alt="Game over">';
  return theme === 'code-vibes' ? art : '<span class="endscreen__badge">GAME OVER</span>';
}

/**
 * Builds the final score entry of one player.
 * @param entry - Player color and final score as pair.
 * @returns HTML markup of the score entry.
 */
function scoreTemplate(entry: [string, number]): string {
  const [player, points] = entry;
  return `
    <li class="game-bar__score" data-player="${player}">
      <span class="game-bar__icon" aria-hidden="true"></span>
      <span class="game-bar__name">${PLAYER_LABELS[player as PlayerColor]}</span>
      <output data-target="${points}">0</output>
    </li>`;
}

/**
 * Builds the first panel of the end screen with heading and final score.
 * @param theme - Theme of the finished game.
 * @param scores - Final score per player.
 * @returns HTML markup of the panel.
 */
function overTemplate(theme: ThemeId, scores: Scores): string {
  const entries = Object.entries(scores) as [string, number][];
  return `
    <article class="endscreen__panel endscreen__panel--over">
      <h1 class="endscreen__title">${titleTemplate(theme)}</h1>
      <p class="endscreen__label">Final score</p>
      <ul class="endscreen__scores game-bar__scores" aria-label="Final score">${entries.map(scoreTemplate).join('')}</ul>
    </article>`;
}

/**
 * Wraps every letter in a span with an index for the staggered entrance animation.
 * @param text - Text to split.
 * @returns HTML markup with one span per letter.
 */
function lettersTemplate(text: string): string {
  return [...text].map((char, i) => `<span style="--i:${i}" aria-hidden="true">${char}</span>`).join('');
}

/**
 * Builds the large symbol of the result: trophy, pawn or scale.
 * @param theme - Theme of the finished game.
 * @param winner - Winning player, or null for a draw.
 * @returns HTML markup of the symbol.
 */
function heroTemplate(theme: ThemeId, winner: PlayerColor | null): string {
  if (!winner) return '<span class="endscreen__hero endscreen__hero--scale" aria-hidden="true"></span>';
  if (theme === 'gaming') return '<img class="endscreen__hero endscreen__hero--trophy" src="./images/end/trophy.svg" alt="Trophy">';
  return '<span class="endscreen__hero endscreen__hero--pawn" aria-hidden="true"></span>';
}

/**
 * Builds the second panel of the end screen with winner or draw.
 * @param theme - Theme of the finished game.
 * @param scores - Final score per player.
 * @returns HTML markup of the panel.
 */
function resultTemplate(theme: ThemeId, scores: Scores): string {
  const leaders = findLeaders(scores);
  const winner = leaders.length > 1 ? null : leaders[0];
  const name = winner ? `${PLAYER_LABELS[winner]} Player` : 'DRAW';
  return `
    <article class="endscreen__panel endscreen__panel--result" data-result="${winner ? 'win' : 'draw'}">
      <p class="endscreen__kicker">${winner ? 'The <strong>winner</strong> is' : "It's a"}</p>
      <h2 class="endscreen__name" data-player="${winner ?? 'draw'}" aria-label="${name}">${lettersTemplate(name)}</h2>
      <figure class="endscreen__hero-wrap" data-player="${winner ?? 'draw'}">${heroTemplate(theme, winner)}</figure>
      <button id="restart-btn" class="endscreen__button" type="button">${RESTART_LABELS[theme]}</button>
    </article>`;
}

/**
 * Builds the complete end screen including the effects canvas.
 * @param theme - Theme of the finished game.
 * @param scores - Final score per player.
 * @returns HTML markup of the end screen.
 */
function screenTemplate(theme: ThemeId, scores: Scores): string {
  return `
    <section class="endscreen" data-theme="${theme}" data-phase="over" aria-label="Game over">
      <canvas class="endscreen__fx" aria-hidden="true"></canvas>
      ${overTemplate(theme, scores)}
      ${resultTemplate(theme, scores)}
    </section>`;
}

/**
 * Counts the displayed scores up from zero to their final value.
 * @param root - Element containing the score outputs.
 */
function countUp(root: HTMLElement): void {
  root.querySelectorAll<HTMLOutputElement>('output[data-target]').forEach((output) => {
    const target = Number(output.dataset.target);
    const started = performance.now();
    const step = (now: number): void => {
      const progress = Math.min(1, (now - started) / 1100);
      output.textContent = String(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/**
 * Switches from the game over panel to the result and starts the celebration. A draw stays calm and gets no fireworks.
 * @param root - Root element of the end screen.
 * @param theme - Theme of the finished game.
 * @param isDraw - True if several players share the top score.
 */
function revealResult(root: HTMLElement, theme: ThemeId, isDraw: boolean): void {
  root.dataset.phase = 'result';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isDraw) return playDraw();
  playWin();
  if (!reduceMotion) celebrate(root.querySelector('canvas')!, theme);
}

/**
 * Renders the themed end screen with animations and wires the restart button.
 * @param content - Container element that receives the screen.
 * @param scores - Final score per player.
 * @param theme - Theme of the finished game.
 * @param onRestart - Called when the user leaves the end screen.
 */
export function renderGameOverScreen(content: HTMLElement, scores: Scores, theme: ThemeId, onRestart: () => void): void {
  content.innerHTML = screenTemplate(theme, scores);
  const root = content.querySelector('.endscreen') as HTMLElement;
  countUp(root);
  window.setTimeout(() => revealResult(root, theme, findLeaders(scores).length > 1), RESULT_DELAY_MS);
  content.querySelector('#restart-btn')?.addEventListener('click', () => {
    stopEffects();
    onRestart();
  });
}

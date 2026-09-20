import type { PlayerColor, ThemeId } from '../models/theme.model';
import { PLAYER_LABELS } from '../config/player.config';
import { celebrate, stopEffects } from '../services/effects.service';
import { playWin, playDraw } from '../services/sound.service';

type Scores = Partial<Record<PlayerColor, number>>;

const RESULT_DELAY_MS = 1700;
const RESTART_LABELS: Record<ThemeId, string> = {
  'code-vibes': 'Back to start',
  gaming: 'Home',
  'da-projects': 'Home',
  foods: 'Home',
};

/** Ermittelt den bzw. die Spieler mit dem hoechsten Punktestand. */
function findLeaders(scores: Scores): PlayerColor[] {
  const entries = Object.entries(scores) as [PlayerColor, number][];
  const topScore = Math.max(...entries.map(([, points]) => points));
  return entries.filter(([, points]) => points === topScore).map(([player]) => player);
}

/** Schriftzug "Game over": Original-Grafik bei Code Vibes, sonst gelbes Schild. */
function titleTemplate(theme: ThemeId): string {
  const art = '<img class="endscreen__title-art" src="/images/end/game-over.svg" alt="Game over">';
  return theme === 'code-vibes' ? art : '<span class="endscreen__badge">GAME OVER</span>';
}

function scoreTemplate([player, points]: [string, number]): string {
  return `
    <span class="game-bar__score" data-player="${player}">
      <i class="game-bar__icon" aria-hidden="true"></i>
      <span class="game-bar__name">${PLAYER_LABELS[player as PlayerColor]}</span>
      <output data-target="${points}">0</output>
    </span>`;
}

function overTemplate(theme: ThemeId, scores: Scores): string {
  const entries = Object.entries(scores) as [string, number][];
  return `
    <section class="endscreen__panel endscreen__panel--over">
      <h1 class="endscreen__title">${titleTemplate(theme)}</h1>
      <p class="endscreen__label">Final score</p>
      <div class="endscreen__scores game-bar__scores">${entries.map(scoreTemplate).join('')}</div>
    </section>`;
}

/** Jeder Buchstabe bekommt einen Index fuer die gestaffelte Einblend-Animation. */
function lettersTemplate(text: string): string {
  return [...text].map((char, i) => `<span style="--i:${i}">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
}

function heroTemplate(theme: ThemeId, winner: PlayerColor | null): string {
  if (!winner) return '<span class="endscreen__hero endscreen__hero--scale" aria-hidden="true"></span>';
  if (theme === 'gaming') return '<img class="endscreen__hero endscreen__hero--trophy" src="/images/end/trophy.svg" alt="Trophy">';
  return '<span class="endscreen__hero endscreen__hero--pawn" aria-hidden="true"></span>';
}

function resultTemplate(theme: ThemeId, scores: Scores): string {
  const leaders = findLeaders(scores);
  const winner = leaders.length > 1 ? null : leaders[0];
  const name = winner ? `${PLAYER_LABELS[winner]} Player` : 'DRAW';
  return `
    <section class="endscreen__panel endscreen__panel--result" data-result="${winner ? 'win' : 'draw'}">
      <p class="endscreen__kicker">${winner ? 'The <mark>winner</mark> is' : "It's a"}</p>
      <h2 class="endscreen__name" data-player="${winner ?? 'draw'}">${lettersTemplate(name)}</h2>
      <div class="endscreen__hero-wrap" data-player="${winner ?? 'draw'}">${heroTemplate(theme, winner)}</div>
      <button id="restart-btn" class="endscreen__button" type="button">${RESTART_LABELS[theme]}</button>
    </section>`;
}

function screenTemplate(theme: ThemeId, scores: Scores): string {
  return `
    <main class="endscreen" data-theme="${theme}" data-phase="over">
      <canvas class="endscreen__fx" aria-hidden="true"></canvas>
      ${overTemplate(theme, scores)}
      ${resultTemplate(theme, scores)}
    </main>`;
}

/** Zaehlt die Punktzahlen von 0 bis zum Endstand hoch. */
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

/** Wechselt vom "Game over" zum Ergebnis und startet die Feier bzw. den ruhigen Unentschieden-Screen. */
function revealResult(root: HTMLElement, theme: ThemeId, isDraw: boolean): void {
  root.dataset.phase = 'result';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isDraw) return playDraw();
  playWin();
  if (!reduceMotion) celebrate(root.querySelector('canvas')!, theme);
}

/** Zeigt das Endergebnis themenbasiert mit Animationen und erlaubt den Rueckweg zum Homescreen. */
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

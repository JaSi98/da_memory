import type { PlayerColor } from '../models/theme.model';
import { PLAYER_LABELS } from '../config/player.config';
import { playWin, playDraw } from '../services/sound.service';

type Scores = Partial<Record<PlayerColor, number>>;

function scorePillsTemplate(scores: Scores): string {
  const pills = Object.entries(scores)
    .map(([player, points]) => `<span class="game-bar__score game-bar__score--${player}">${PLAYER_LABELS[player as PlayerColor]} ${points}</span>`)
    .join('');
  return `<div class="gameover__scores">${pills}</div>`;
}

/** Ermittelt den bzw. die Spieler mit dem hoechsten Punktestand. */
function findLeaders(scores: Scores): PlayerColor[] {
  const entries = Object.entries(scores) as [PlayerColor, number][];
  const topScore = Math.max(...entries.map(([, points]) => points));
  return entries.filter(([, points]) => points === topScore).map(([player]) => player);
}

function drawTemplate(): string {
  return `
    <span class="gameover__icon">⚖️</span>
    <p class="gameover__winner">It's a draw</p>`;
}

function winnerTemplate(winner: PlayerColor): string {
  return `
    <span class="gameover__icon">🎉</span>
    <p class="gameover__result">The winner is</p>
    <p class="gameover__winner gameover__winner--${winner}">${PLAYER_LABELS[winner]} player</p>`;
}

function resultTemplate(scores: Scores): string {
  const leaders = findLeaders(scores);
  return leaders.length > 1 ? drawTemplate() : winnerTemplate(leaders[0]);
}

function gameOverTemplate(scores: Scores): string {
  return `
    <section class="gameover">
      <h1 class="gameover__title">Game over</h1>
      <p class="gameover__label">Final score</p>
      ${scorePillsTemplate(scores)}
      ${resultTemplate(scores)}
      <button id="restart-btn" class="button button--primary" type="button">Back to start</button>
    </section>`;
}

/** Zeigt das Endergebnis und erlaubt den Rueckweg zum Homescreen. */
export function renderGameOverScreen(content: HTMLElement, scores: Scores, onRestart: () => void): void {
  content.innerHTML = gameOverTemplate(scores);
  content.querySelector('#restart-btn')?.addEventListener('click', onRestart);
  findLeaders(scores).length > 1 ? playDraw() : playWin();
}

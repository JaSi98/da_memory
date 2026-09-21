import type { PlayerColor } from '../models/theme.model';

let activePlayers: PlayerColor[] = ['blue', 'orange'];
let scores: Partial<Record<PlayerColor, number>> = {};
let activeIndex = 0;

/**
 * Returns the player whose turn it is.
 * @returns Color of the active player.
 */
export function getActivePlayer(): PlayerColor {
  return activePlayers[activeIndex];
}

/**
 * Returns a copy of the current scores.
 * @returns Score per active player.
 */
export function getScores(): Partial<Record<PlayerColor, number>> {
  return { ...scores };
}

/**
 * Gives the active player a point for a found pair.
 */
export function addPoint(): void {
  const player = getActivePlayer();
  scores[player] = (scores[player] ?? 0) + 1;
  renderScore();
}

/**
 * Hands the turn to the next player.
 */
export function switchPlayer(): void {
  activeIndex = (activeIndex + 1) % activePlayers.length;
  renderScore();
}

/**
 * Resets scores and player list for a new game.
 * @param players - Colors of all active players in turn order.
 */
export function resetScores(players: PlayerColor[]): void {
  activePlayers = players;
  scores = Object.fromEntries(players.map((player) => [player, 0]));
  activeIndex = 0;
  renderScore();
}

/**
 * Updates the score outputs and the active player marker in the game bar.
 */
function renderScore(): void {
  for (const player of activePlayers) {
    const output = document.getElementById(`score-${player}`);
    if (output) output.textContent = String(scores[player] ?? 0);
  }
  const bar = document.getElementById('game-bar');
  if (bar) bar.dataset.activePlayer = getActivePlayer();
}

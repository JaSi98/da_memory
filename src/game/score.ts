import type { PlayerColor } from '../models/theme.model';

let activePlayers: PlayerColor[] = ['blue', 'orange'];
let scores: Partial<Record<PlayerColor, number>> = {};
let activeIndex = 0;

/** Der Spieler, der gerade am Zug ist. */
export function getActivePlayer(): PlayerColor {
  return activePlayers[activeIndex];
}

/** Aktueller Punktestand aller aktiven Spieler. */
export function getScores(): Partial<Record<PlayerColor, number>> {
  return { ...scores };
}

/** Schreibt dem aktiven Spieler ein gefundenes Paar gut. */
export function addPoint(): void {
  const player = getActivePlayer();
  scores[player] = (scores[player] ?? 0) + 1;
  renderScore();
}

/** Gibt den Zug an den naechsten Spieler ab. */
export function switchPlayer(): void {
  activeIndex = (activeIndex + 1) % activePlayers.length;
  renderScore();
}

/** Setzt Punktestand und Spielerliste fuer eine neue Partie zurueck. */
export function resetScores(players: PlayerColor[]): void {
  activePlayers = players;
  scores = Object.fromEntries(players.map((player) => [player, 0]));
  activeIndex = 0;
  renderScore();
}

/** Aktualisiert Punktestand und Spieleranzeige in der Game-Bar. */
function renderScore(): void {
  for (const player of activePlayers) {
    const output = document.getElementById(`score-${player}`);
    if (output) output.textContent = String(scores[player] ?? 0);
  }
  const bar = document.getElementById('game-bar');
  if (bar) bar.dataset.activePlayer = getActivePlayer();
}

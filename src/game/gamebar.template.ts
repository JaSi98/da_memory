import type { PlayerColor } from '../models/theme.model';
import { PLAYER_LABELS } from '../config/player.config';

function scoreTemplate(player: PlayerColor, computerPlayer: PlayerColor | null): string {
  const label = player === computerPlayer ? 'Computer 🤖' : PLAYER_LABELS[player];
  return `<span class="game-bar__score game-bar__score--${player}">${label} <output id="score-${player}">0</output></span>`;
}

/** Markup der Punkteleiste oberhalb des Spielfelds. */
export function gameBarTemplate(players: PlayerColor[], computerPlayer: PlayerColor | null): string {
  return `
    <header id="game-bar" class="game-bar">
      <div class="game-bar__scores">
        ${players.map((player) => scoreTemplate(player, computerPlayer)).join('')}
      </div>
      <span class="game-bar__current">
        Am Zug <span class="game-bar__dot"></span>
      </span>
      <button id="exit-game-btn" class="button button--ghost" type="button">Exit game</button>
    </header>`;
}

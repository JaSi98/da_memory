import type { PlayerColor } from '../models/theme.model';
import { PLAYER_LABELS } from '../config/player.config';

const BOT_BADGE = '<span class="game-bar__bot" role="img" aria-label="Computer">CPU</span>';

/**
 * Builds the score entry of a single player for the game bar.
 * @param player - Color of the player.
 * @param computerPlayer - Color controlled by the computer, or null in a game without computer.
 * @returns HTML markup of the score entry.
 */
function scoreTemplate(player: PlayerColor, computerPlayer: PlayerColor | null): string {
  return `
    <span class="game-bar__score" data-player="${player}">
      <i class="game-bar__icon" aria-hidden="true"></i>
      <span class="game-bar__name">${PLAYER_LABELS[player]}</span>
      <output id="score-${player}">0</output>${player === computerPlayer ? BOT_BADGE : ''}
    </span>`;
}

/**
 * Builds the game bar above the board with scores, current player and exit button. The look of each part is defined by the theme in CSS.
 * @param players - Colors of all active players in turn order.
 * @param computerPlayer - Color controlled by the computer, or null in a game without computer.
 * @returns HTML markup of the game bar.
 */
export function gameBarTemplate(players: PlayerColor[], computerPlayer: PlayerColor | null): string {
  return `
    <header id="game-bar" class="game-bar" data-active-player="${players[0]}">
      <div class="game-bar__scores">
        ${players.map((player) => scoreTemplate(player, computerPlayer)).join('')}
      </div>
      <p class="game-bar__current">
        Current player:
        <span class="game-bar__token"><i class="game-bar__icon" aria-hidden="true"></i></span>
      </p>
      <button id="exit-game-btn" class="game-bar__exit" type="button">
        <i class="game-bar__exit-icon" aria-hidden="true"></i>
        Exit game
      </button>
    </header>`;
}

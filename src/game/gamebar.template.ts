import type { PlayerColor } from '../models/theme.model';
import { PLAYER_LABELS } from '../config/player.config';

/** Small tag that marks the score of the computer player. */
const BOT_BADGE = '<span class="game-bar__bot" role="img" aria-label="Computer">CPU</span>';

/**
 * Builds the score entry of a single player for the game bar.
 * @param player - Color of the player.
 * @param computerPlayer - Color controlled by the computer, or null in a game without computer.
 * @returns HTML markup of the score entry.
 */
function scoreTemplate(player: PlayerColor, computerPlayer: PlayerColor | null): string {
  return `
    <li class="game-bar__score" data-player="${player}">
      <span class="game-bar__icon" aria-hidden="true"></span>
      <span class="game-bar__name">${PLAYER_LABELS[player]}</span>
      <output id="score-${player}">0</output>${player === computerPlayer ? BOT_BADGE : ''}
    </li>`;
}

/**
 * Builds the exit control: a real button in the game, a plain hidden label in the preview.
 * @param isPreview - True for the static preview in the settings.
 * @returns HTML markup of the exit control.
 */
function exitTemplate(isPreview: boolean): string {
  const tag = isPreview ? 'span aria-hidden="true"' : 'button id="exit-game-btn" type="button"';
  return `
      <${tag} class="game-bar__exit">
        <span class="game-bar__exit-icon" aria-hidden="true"></span>
        Exit game
      </${isPreview ? 'span' : 'button'}>`;
}

/**
 * Builds the game bar above the board with scores, current player and exit button. The look of each part is defined by the theme in CSS.
 * @param players - Colors of all active players in turn order.
 * @param computerPlayer - Color controlled by the computer, or null in a game without computer.
 * @param isPreview - True for the static preview in the settings, where the exit control is not interactive.
 * @returns HTML markup of the game bar.
 */
export function gameBarTemplate(players: PlayerColor[], computerPlayer: PlayerColor | null, isPreview = false): string {
  return `
    <header id="game-bar" class="game-bar" data-active-player="${players[0]}">
      <ul class="game-bar__scores">
        ${players.map((player) => scoreTemplate(player, computerPlayer)).join('')}
      </ul>
      <p class="game-bar__current">
        Current player:
        <span class="game-bar__token"><span class="game-bar__icon" aria-hidden="true"></span></span>
      </p>
      ${exitTemplate(isPreview)}
    </header>`;
}

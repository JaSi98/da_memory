import type { PlayerColor, PlayerCount } from '../models/theme.model';

export const PLAYER_COLORS: PlayerColor[] = ['blue', 'orange', 'green', 'purple'];

export const PLAYER_LABELS: Record<PlayerColor, string> = {
  blue: 'Blue',
  orange: 'Orange',
  green: 'Green',
  purple: 'Purple',
};

/**
 * Returns the colors of all players taking part. A single human player always plays against the computer, so at least two colors are returned.
 * @param count - Player count chosen in the settings (1 to 4).
 * @returns Player colors in turn order.
 */
export function getActivePlayers(count: PlayerCount): PlayerColor[] {
  return count === 1 ? PLAYER_COLORS.slice(0, 2) : PLAYER_COLORS.slice(0, count);
}

/**
 * Determines which player color is controlled by the computer.
 * @param count - Player count chosen in the settings (1 to 4).
 * @returns The computer color for a single human player, otherwise null.
 */
export function getComputerPlayer(count: PlayerCount): PlayerColor | null {
  return count === 1 ? 'orange' : null;
}

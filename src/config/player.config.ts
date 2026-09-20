import type { PlayerColor, PlayerCount } from '../models/theme.model';

export const PLAYER_COLORS: PlayerColor[] = ['blue', 'orange', 'green', 'purple'];

export const PLAYER_LABELS: Record<PlayerColor, string> = {
  blue: 'Blue',
  orange: 'Orange',
  green: 'Green',
  purple: 'Purple',
};

/** Liefert die aktiven Spielerfarben fuer die gewaehlte Spieleranzahl. */
export function getActivePlayers(count: PlayerCount): PlayerColor[] {
  return count === 1 ? PLAYER_COLORS.slice(0, 2) : PLAYER_COLORS.slice(0, count);
}

/** Bei einem Solo-Spiel uebernimmt Orange den Computer-Gegner. */
export function getComputerPlayer(count: PlayerCount): PlayerColor | null {
  return count === 1 ? 'orange' : null;
}

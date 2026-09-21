/** Id of a theme; it is also the folder name of its images. */
export type ThemeId = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';

/** Board size as rows times columns (16, 24 or 36 cards). */
export type BoardSize = '4x4' | '4x6' | '6x6';

/** Color that identifies a player. */
export type PlayerColor = 'blue' | 'orange' | 'green' | 'purple';

/** Number of players chosen in the settings; 1 means a game against the computer. */
export type PlayerCount = 1 | 2 | 3 | 4;

/**
 * Configuration of a theme.
 */
export interface ThemeConfig {
  /** Id of the theme. */
  id: ThemeId;
  /** Name shown in the settings. */
  label: string;
  /** File name of the motif shown in the settings preview. */
  previewMotif: string;
  /** File names of all motifs without extension. */
  motifs: string[];
}

/**
 * The choices made in the settings screen.
 */
export interface GameSettings {
  /** Chosen theme. */
  theme: ThemeId;
  /** Chosen board size. */
  boardSize: BoardSize;
  /** Chosen number of players. */
  playerCount: PlayerCount;
}

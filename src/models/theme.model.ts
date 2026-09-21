export type ThemeId = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';
export type BoardSize = '4x4' | '4x6' | '6x6';
export type PlayerColor = 'blue' | 'orange' | 'green' | 'purple';
export type PlayerCount = 1 | 2 | 3 | 4;

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  previewMotif: string;
  motifs: string[];
}

export interface GameSettings {
  theme: ThemeId;
  boardSize: BoardSize;
  playerCount: PlayerCount;
}

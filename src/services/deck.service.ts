import { Card } from '../models/card.model';
import { THEMES, motifUrl } from '../config/theme.config';
import type { BoardSize, ThemeId } from '../models/theme.model';

const PAIRS_BY_SIZE: Record<BoardSize, number> = {
  '4x4': 8,
  '4x6': 12,
  '6x6': 18,
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @typeParam T - Type of the array elements.
 * @param items - Array to shuffle.
 * @returns The same array, shuffled.
 */
export function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Picks as many motifs as the board size needs pairs.
 * @param theme - Theme to take motifs from.
 * @param size - Board size.
 * @returns File names of the chosen motifs.
 */
function pickMotifs(theme: ThemeId, size: BoardSize): string[] {
  const available = shuffle([...THEMES[theme].motifs]);
  return available.slice(0, PAIRS_BY_SIZE[size]);
}

/**
 * Creates a card with the path to its motif image.
 * @param id - Unique id of the card.
 * @param pairId - Id shared by both cards of a pair.
 * @param motif - File name of the motif without extension.
 * @param theme - Theme the motif belongs to.
 * @returns The new card.
 */
function createCard(id: number, pairId: number, motif: string, theme: ThemeId): Card {
  return new Card(id, pairId, motif.replace(/-/g, ' '), motifUrl(theme, motif));
}

/**
 * Builds a shuffled deck with two cards per motif.
 * @param theme - Theme to take motifs from.
 * @param size - Board size.
 * @returns All cards of the board in random order.
 */
export function buildDeck(theme: ThemeId, size: BoardSize): Card[] {
  const cards = pickMotifs(theme, size).flatMap((motif, pairId) => [
    createCard(pairId * 2, pairId, motif, theme),
    createCard(pairId * 2 + 1, pairId, motif, theme),
  ]);
  return shuffle(cards);
}
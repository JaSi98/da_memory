import { Card } from '../models/card.model';
import { THEMES, motifUrl } from '../config/theme.config';
import type { BoardSize, ThemeId } from '../models/theme.model';

const PAIRS_BY_SIZE: Record<BoardSize, number> = {
  '4x4': 8,
  '4x6': 12,
  '6x6': 18,
};

/** Mischt ein Array nach Fisher-Yates. */
export function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Waehlt so viele Motive aus, wie die Spielfeldgroesse Paare braucht. */
function pickMotifs(theme: ThemeId, size: BoardSize): string[] {
  const available = shuffle([...THEMES[theme].motifs]);
  return available.slice(0, PAIRS_BY_SIZE[size]);
}

/** Erzeugt eine Karte samt Pfad zum Motiv-SVG. */
function createCard(id: number, pairId: number, motif: string, theme: ThemeId): Card {
  return new Card(id, pairId, motif.replace(/-/g, ' '), motifUrl(theme, motif));
}

/** Baut ein gemischtes Deck mit je zwei Karten pro Motiv. */
export function buildDeck(theme: ThemeId, size: BoardSize): Card[] {
  const cards = pickMotifs(theme, size).flatMap((motif, pairId) => [
    createCard(pairId * 2, pairId, motif, theme),
    createCard(pairId * 2 + 1, pairId, motif, theme),
  ]);
  return shuffle(cards);
}
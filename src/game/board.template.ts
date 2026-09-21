import type { Card } from '../models/card.model';
import type { BoardSize, ThemeId } from '../models/theme.model';
import { coverUrl } from '../config/theme.config';

/**
 * Builds the markup of one card. Its state is added later through CSS classes.
 * @param card - Card to render.
 * @param theme - Theme that provides the cover image.
 * @returns HTML markup of the card.
 */
function cardTemplate(card: Card, theme: ThemeId): string {
  return `
    <button class="card" type="button" data-id="${card.id}">
      <span class="card__inner">
        <img class="card__face card__face--back" src=".${coverUrl(theme)}" alt="">
        <img class="card__face card__face--front" src=".${card.imageUrl}" alt="${card.label}">
      </span>
    </button>`;
}

/**
 * Builds the markup of the whole board.
 * @param cards - All cards in board order.
 * @param size - Board size.
 * @param theme - Theme that provides the cover image.
 * @returns HTML markup of the board.
 */
export function boardTemplate(cards: Card[], size: BoardSize, theme: ThemeId): string {
  return `
    <section class="board" data-size="${size}">
      ${cards.map((card) => cardTemplate(card, theme)).join('')}
    </section>`;
}

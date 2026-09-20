import type { Card } from '../models/card.model';
import type { BoardSize, ThemeId } from '../models/theme.model';
import { coverUrl } from '../config/theme.config';

/** Markup einer Karte. Der Zustand kommt spaeter ueber Klassen dazu. */
function cardTemplate(card: Card, theme: ThemeId): string {
  return `
    <button class="card" type="button" data-id="${card.id}">
      <span class="card__inner">
        <img class="card__face card__face--back" src="${coverUrl(theme)}" alt="">
        <img class="card__face card__face--front" src="${card.imageUrl}" alt="${card.label}">
      </span>
    </button>`;
}

/** Markup des kompletten Spielfelds. */
export function boardTemplate(cards: Card[], size: BoardSize, theme: ThemeId): string {
  return `
    <section class="board" data-size="${size}">
      ${cards.map((card) => cardTemplate(card, theme)).join('')}
    </section>`;
}

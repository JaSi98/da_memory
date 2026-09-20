import type { Card } from '../models/card.model';
import type { BoardSize } from '../models/theme.model';

const BACK_ICON = `
  <svg width="48%" height="48%" viewBox="0 0 48 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="1" width="46" height="28" rx="4"></rect>
    <polyline points="18 9 12 15 18 21"></polyline>
    <polyline points="30 9 36 15 30 21"></polyline>
    <line x1="14" y1="34" x2="22" y2="34"></line>
    <line x1="26" y1="34" x2="34" y2="34"></line>
  </svg>`;

/** Markup einer Karte. Der Zustand kommt spaeter ueber Klassen dazu. */
function cardTemplate(card: Card): string {
  return `
    <button class="card" type="button" data-id="${card.id}">
      <span class="card__inner">
        <span class="card__face card__face--back">${BACK_ICON}</span>
        <span class="card__face card__face--front">
          <img src="${card.imageUrl}" alt="${card.label}">
        </span>
      </span>
    </button>`;
}

/** Markup des kompletten Spielfelds. */
export function boardTemplate(cards: Card[], size: BoardSize): string {
  return `
    <section class="board" data-size="${size}">
      ${cards.map(cardTemplate).join('')}
    </section>`;
}

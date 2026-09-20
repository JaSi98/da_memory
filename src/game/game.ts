import { buildDeck } from '../services/deck.service';
import { boardTemplate } from './board.template';
import { gameBarTemplate } from './gamebar.template';
import { showExitPopup } from '../screens/popup.screen';
import { getActivePlayers, getComputerPlayer } from '../config/player.config';
import type { Card } from '../models/card.model';
import type { GameSettings, PlayerColor } from '../models/theme.model';
import { addPoint, switchPlayer, getScores, resetScores, getActivePlayer } from './score';
import { playFlip, playMatch, playMismatch } from '../services/sound.service';

const FLIP_BACK_DELAY_MS = 800;
const COMPUTER_MOVE_DELAY_MS = 700;

type Scores = Partial<Record<PlayerColor, number>>;

let content: HTMLElement;
let cards: Card[] = [];
let flipped: Card[] = [];
let seenCards = new Set<number>();
let isLocked = false;
let computerPlayer: PlayerColor | null = null;
let onGameOver: (scores: Scores) => void = () => {};
let onQuit: () => void = () => {};

/** Baut das Spielfeld in den Content-Bereich und haengt die Listener an. */
export function startGame(
  target: HTMLElement,
  settings: GameSettings,
  onFinish: (scores: Scores) => void,
  onExit: () => void
): void {
  content = target;
  onGameOver = onFinish;
  onQuit = onExit;
  computerPlayer = getComputerPlayer(settings.playerCount);
  cards = buildDeck(settings.theme, settings.boardSize);
  flipped = [];
  seenCards = new Set<number>();
  isLocked = false;
  renderBoard(settings);
  resetScores(getActivePlayers(settings.playerCount));
}

/** Rendert Punkteleiste und Spielfeld und bindet die Klick-Listener. */
function renderBoard(settings: GameSettings): void {
  const players = getActivePlayers(settings.playerCount);
  const board = boardTemplate(cards, settings.boardSize, settings.theme);
  content.innerHTML = `
    <main class="game-screen" data-theme="${settings.theme}">
      ${gameBarTemplate(players, computerPlayer)}${board}
    </main>`;
  content.querySelector('.game-screen')?.addEventListener('click', handleBoardClick as EventListener);
  content.querySelector('#exit-game-btn')?.addEventListener('click', () => showExitPopup(content, onQuit));
}

/** Sucht das DOM-Element zu einer Karte. */
function findElement(card: Card): HTMLElement {
  return content.querySelector(`.card[data-id="${card.id}"]`) as HTMLElement;
}

/** Nimmt Klicks im Spielfeld per Event Delegation entgegen. */
function handleBoardClick(event: MouseEvent): void {
  const element = (event.target as HTMLElement).closest<HTMLElement>('.card');
  if (isLocked || !element || getActivePlayer() === computerPlayer) return;

  const card = cards.find((item) => item.id === Number(element.dataset.id));
  if (!card || card.isFlipped || card.isMatched) return;

  revealCard(card, element);
  if (flipped.length === 2) checkPair();
}

/** Sucht zu einer Karte die passende Partnerkarte, die schon einmal aufgedeckt wurde. */
function findKnownPartner(card: Card): Card | undefined {
  return cards.find((other) => other.id !== card.id && other.pairId === card.pairId
    && seenCards.has(other.id) && !other.isMatched);
}

/** Sucht ein Paar, dessen beide Karten dem Computer schon bekannt sind. */
function findKnownPair(): [Card, Card] | undefined {
  for (const card of cards.filter((item) => seenCards.has(item.id) && !item.isMatched)) {
    const partner = findKnownPartner(card);
    if (partner) return [card, partner];
  }
  return undefined;
}

/** Waehlt eine zufaellige, noch verdeckte Karte (unbekannte Karten werden bevorzugt). */
function pickRandomCard(exclude: Card[] = []): Card | undefined {
  const open = cards.filter((card) => !card.isFlipped && !card.isMatched && !exclude.includes(card));
  const unseen = open.filter((card) => !seenCards.has(card.id));
  const pool = unseen.length > 0 ? unseen : open;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Waehlt die zweite Karte: den bekannten Partner der ersten, sonst eine zufaellige. */
function pickNextComputerCard(): Card | undefined {
  if (flipped.length === 1) return findKnownPartner(flipped[0]) ?? pickRandomCard(flipped);
  return pickRandomCard();
}

/** Deckt ein Paar auf, das der Computer sich gemerkt hat. */
function playKnownPair([first, second]: [Card, Card]): void {
  revealCard(first, findElement(first));
  window.setTimeout(() => {
    revealCard(second, findElement(second));
    checkPair();
  }, COMPUTER_MOVE_DELAY_MS);
}

/** Spielt einen Computer-Zug: erst gemerkte Paare, sonst aufdecken und dazulernen. */
function playComputerCard(): void {
  const pair = flipped.length === 0 ? findKnownPair() : undefined;
  if (pair) return playKnownPair(pair);
  const card = pickNextComputerCard();
  if (!card) return;
  revealCard(card, findElement(card));
  if (flipped.length === 2) checkPair();
  else window.setTimeout(playComputerCard, COMPUTER_MOVE_DELAY_MS);
}

/** Stoesst den Computer-Zug an, sofern der Computer aktuell am Zug ist. */
function maybeTakeComputerTurn(): void {
  if (getActivePlayer() !== computerPlayer) return;
  window.setTimeout(playComputerCard, COMPUTER_MOVE_DELAY_MS);
}

/** Deckt eine Karte auf: Zustand im Modell, Klasse im DOM. */
function revealCard(card: Card, element: HTMLElement): void {
  card.isFlipped = true;
  element.classList.add('is-flipped');
  flipped.push(card);
  seenCards.add(card.id);
  playFlip();
}

/** Prueft das aufgedeckte Paar. */
function checkPair(): void {
  const [first, second] = flipped;
  isLocked = true;

  if (first.pairId === second.pairId) {
    markAsMatched(first, second);
    return;
  }
  playMismatch();
  window.setTimeout(() => hidePair(first, second), FLIP_BACK_DELAY_MS);
}

/** Markiert ein gefundenes Paar dauerhaft, eingefaerbt in der Farbe des findenden Spielers. */
function markAsMatched(first: Card, second: Card): void {
  const player = getActivePlayer();
  for (const card of [first, second]) {
    card.isMatched = true;
    findElement(card).classList.add('is-matched', `is-matched--${player}`);
  }
  playMatch();
  addPoint();
  endTurn(true);
}

/** Dreht ein nicht passendes Paar zurueck. */
function hidePair(first: Card, second: Card): void {
  for (const card of [first, second]) {
    card.isFlipped = false;
    findElement(card).classList.remove('is-flipped');
  }
  endTurn(false);
}

/** Schliesst den Zug ab, prueft auf Spielende und stoesst ggf. den Computer an. */
function endTurn(wasMatch: boolean): void {
  flipped = [];
  isLocked = false;
  if (!wasMatch) switchPlayer();
  if (cards.every((card) => card.isMatched)) return finishGame();
  maybeTakeComputerTurn();
}

/** Beendet das Spiel und meldet das Ergebnis an den Aufrufer. */
function finishGame(): void {
  onGameOver(getScores());
}

import { buildDeck } from '../services/deck.service';
import { boardTemplate } from './board.template';
import { gameBarTemplate } from './gamebar.template';
import { showExitPopup } from '../screens/popup.screen';
import { getActivePlayers, getComputerPlayer } from '../config/player.config';
import type { Card } from '../models/card.model';
import type { GameSettings, PlayerColor } from '../models/theme.model';
import { addPoint, switchPlayer, getScores, resetScores, getActivePlayer } from './score';
import { playFlip, playMatch, playMismatch } from '../services/sound.service';

/** How long a wrong pair stays visible before it is turned back, in milliseconds. */
const FLIP_BACK_DELAY_MS = 800;
/** Pause between the steps of a computer turn, in milliseconds. */
const COMPUTER_MOVE_DELAY_MS = 700;

/** Final or current score per player color. */
type Scores = Partial<Record<PlayerColor, number>>;

/** Container element that holds the game screen. */
let content: HTMLElement;
/** All cards of the current board. */
let cards: Card[] = [];
/** Cards revealed in the current turn (zero, one or two). */
let flipped: Card[] = [];
/** Ids of all cards that were revealed at least once; this is the memory of the computer. */
let seenCards = new Set<number>();
/** True while a turn is being resolved, so no further card can be picked. */
let isLocked = false;
/** Color controlled by the computer, or null in a game without computer. */
let computerPlayer: PlayerColor | null = null;
/** Called with the final scores when the game ends. */
let onGameOver: (scores: Scores) => void = () => {};
/** Called when the user confirms leaving the game. */
let onQuit: () => void = () => {};

/**
 * Builds the board into the content container and attaches the listeners.
 * @param target - Container element that receives the board.
 * @param settings - Theme, board size and player count.
 * @param onFinish - Called with the final scores when all pairs are found.
 * @param onExit - Called when the user leaves the game.
 */
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

/**
 * Renders game bar and board and binds the click listeners.
 * @param settings - Theme, board size and player count.
 */
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

/**
 * Finds the DOM element that belongs to a card.
 * @param card - Card to look up.
 * @returns The card button element.
 */
function findElement(card: Card): HTMLElement {
  return content.querySelector(`.card[data-id="${card.id}"]`) as HTMLElement;
}

/**
 * Handles clicks on the board using event delegation.
 * @param event - Click event from the board.
 */
function handleBoardClick(event: MouseEvent): void {
  const element = (event.target as HTMLElement).closest<HTMLElement>('.card');
  if (isLocked || !element || getActivePlayer() === computerPlayer) return;

  const card = cards.find((item) => item.id === Number(element.dataset.id));
  if (!card || card.isFlipped || card.isMatched) return;

  revealCard(card, element);
  if (flipped.length === 2) checkPair();
}

/**
 * Finds the partner of a card if that partner was revealed before and is not matched yet.
 * @param card - Card whose partner is searched.
 * @returns The known partner card, or undefined.
 */
function findKnownPartner(card: Card): Card | undefined {
  return cards.find((other) => other.id !== card.id && other.pairId === card.pairId
    && seenCards.has(other.id) && !other.isMatched);
}

/**
 * Finds a pair whose two cards are both already known to the computer.
 * @returns The two cards of the pair, or undefined.
 */
function findKnownPair(): [Card, Card] | undefined {
  for (const card of cards.filter((item) => seenCards.has(item.id) && !item.isMatched)) {
    const partner = findKnownPartner(card);
    if (partner) return [card, partner];
  }
  return undefined;
}

/**
 * Picks a random hidden card; cards that were never seen are preferred.
 * @param exclude - Cards that must not be picked.
 * @returns The chosen card, or undefined if none is left.
 */
function pickRandomCard(exclude: Card[] = []): Card | undefined {
  const open = cards.filter((card) => !card.isFlipped && !card.isMatched && !exclude.includes(card));
  const unseen = open.filter((card) => !seenCards.has(card.id));
  const pool = unseen.length > 0 ? unseen : open;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Picks the next card for the computer: the known partner of the first card, otherwise a random one.
 * @returns The chosen card, or undefined if none is left.
 */
function pickNextComputerCard(): Card | undefined {
  if (flipped.length === 1) return findKnownPartner(flipped[0]) ?? pickRandomCard(flipped);
  return pickRandomCard();
}

/**
 * Reveals a pair that the computer remembered, one card after the other.
 * @param pair - The two cards of the pair.
 */
function playKnownPair(pair: [Card, Card]): void {
  const [first, second] = pair;
  revealCard(first, findElement(first));
  window.setTimeout(() => {
    revealCard(second, findElement(second));
    checkPair();
  }, COMPUTER_MOVE_DELAY_MS);
}

/**
 * Plays one step of the computer turn: remembered pairs first, otherwise reveal a card and learn.
 */
function playComputerCard(): void {
  const pair = flipped.length === 0 ? findKnownPair() : undefined;
  if (pair) return playKnownPair(pair);
  const card = pickNextComputerCard();
  if (!card) return;
  revealCard(card, findElement(card));
  if (flipped.length === 2) checkPair();
  else window.setTimeout(playComputerCard, COMPUTER_MOVE_DELAY_MS);
}

/**
 * Starts the computer turn if the computer is the active player.
 */
function maybeTakeComputerTurn(): void {
  if (getActivePlayer() !== computerPlayer) return;
  window.setTimeout(playComputerCard, COMPUTER_MOVE_DELAY_MS);
}

/**
 * Reveals a card in the model and in the DOM.
 * @param card - Card to reveal.
 * @param element - Button element of the card.
 */
function revealCard(card: Card, element: HTMLElement): void {
  card.isFlipped = true;
  element.classList.add('is-flipped');
  flipped.push(card);
  seenCards.add(card.id);
  playFlip();
}

/**
 * Checks the two revealed cards.
 */
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

/**
 * Marks a found pair permanently, colored in the color of the player who found it.
 * @param first - First card of the pair.
 * @param second - Second card of the pair.
 */
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

/**
 * Turns a non matching pair back over.
 * @param first - First card of the pair.
 * @param second - Second card of the pair.
 */
function hidePair(first: Card, second: Card): void {
  for (const card of [first, second]) {
    card.isFlipped = false;
    findElement(card).classList.remove('is-flipped');
  }
  endTurn(false);
}

/**
 * Ends the turn, checks for the end of the game and triggers the computer if needed.
 * @param wasMatch - True if the turn found a pair; the same player then continues.
 */
function endTurn(wasMatch: boolean): void {
  flipped = [];
  isLocked = false;
  if (!wasMatch) switchPlayer();
  if (cards.every((card) => card.isMatched)) return finishGame();
  maybeTakeComputerTurn();
}

/**
 * Ends the game and reports the result to the caller.
 */
function finishGame(): void {
  onGameOver(getScores());
}

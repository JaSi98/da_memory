import './styles/style.scss';
import { renderHomeScreen } from './screens/home.screen';
import { renderSettingsScreen } from './screens/settings.screen';
import { renderGameOverScreen } from './screens/gameover.screen';
import { startGame } from './game/game';
import type { GameSettings, PlayerColor, ThemeId } from './models/theme.model';

/** Final or current score per player color. */
type Scores = Partial<Record<PlayerColor, number>>;

/**
 * Shows the home screen; the play button leads to the settings.
 * @param content - Container element that receives the screen.
 */
function showHome(content: HTMLElement): void {
  renderHomeScreen(content, () => showSettings(content));
}

/**
 * Shows the settings screen; starting the game leads to the board.
 * @param content - Container element that receives the screen.
 */
function showSettings(content: HTMLElement): void {
  renderSettingsScreen(content, (settings) => showGame(content, settings));
}

/**
 * Starts a game; when it ends or is aborted the matching screen is shown.
 * @param content - Container element that receives the screen.
 * @param settings - Theme, board size and player count chosen by the user.
 */
function showGame(content: HTMLElement, settings: GameSettings): void {
  startGame(content, settings, (scores) => showGameOver(content, scores, settings.theme), () => showHome(content));
}

/**
 * Shows the themed end screen; its button leads back to the home screen.
 * @param content - Container element that receives the screen.
 * @param scores - Final score per player.
 * @param theme - Theme of the finished game.
 */
function showGameOver(content: HTMLElement, scores: Scores, theme: ThemeId): void {
  renderGameOverScreen(content, scores, theme, () => showHome(content));
}

/**
 * Starts the app by showing the home screen inside the content container.
 */
function init(): void {
  const content = document.getElementById('content');
  if (content) showHome(content);
}

document.addEventListener('DOMContentLoaded', init);

import './styles/style.scss';
import { renderHomeScreen } from './screens/home.screen';
import { renderSettingsScreen } from './screens/settings.screen';
import { renderGameOverScreen } from './screens/gameover.screen';
import { startGame } from './game/game';
import type { GameSettings, PlayerColor } from './models/theme.model';

type Scores = Partial<Record<PlayerColor, number>>;

/** Zeigt den Homescreen; von dort geht es weiter zu den Einstellungen. */
function showHome(content: HTMLElement): void {
  renderHomeScreen(content, () => showSettings(content));
}

/** Zeigt die Einstellungen an; nach dem Start geht es direkt ins Spiel. */
function showSettings(content: HTMLElement): void {
  renderSettingsScreen(content, (settings) => showGame(content, settings));
}

/** Startet das Spiel; bei Spielende oder Abbruch wechselt der Screen. */
function showGame(content: HTMLElement, settings: GameSettings): void {
  startGame(content, settings, (scores) => showGameOver(content, scores), () => showHome(content));
}

/** Zeigt das Ergebnis; "Back to start" fuehrt zurueck zum Homescreen. */
function showGameOver(content: HTMLElement, scores: Scores): void {
  renderGameOverScreen(content, scores, () => showHome(content));
}

function init(): void {
  const content = document.getElementById('content');
  if (content) showHome(content);
}

document.addEventListener('DOMContentLoaded', init);

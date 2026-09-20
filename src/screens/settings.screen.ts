import { THEMES } from '../config/theme.config';
import type { GameSettings, BoardSize, PlayerCount, ThemeId } from '../models/theme.model';

const BOARD_SIZES: { value: BoardSize; label: string }[] = [
  { value: '4x4', label: '16 cards' },
  { value: '4x6', label: '24 cards' },
  { value: '6x6', label: '36 cards' },
];
const PLAYER_COUNTS: { value: PlayerCount; label: string }[] = [
  { value: 1, label: '1 Player (vs Computer)' },
  { value: 2, label: '2 Players' },
  { value: 3, label: '3 Players' },
  { value: 4, label: '4 Players' },
];

function optionTemplate(name: string, value: string, text: string, checked: boolean): string {
  const id = `${name}-${value}`;
  return `
    <li class="settings__option">
      <input type="radio" name="${name}" value="${value}" id="${id}" ${checked ? 'checked' : ''}>
      <label for="${id}">${text}</label>
    </li>`;
}

/** Radioliste fuer die auswaehlbaren Themes (nur solche mit Motiven). */
function themeOptionsTemplate(): string {
  return Object.values(THEMES)
    .filter((theme) => theme.motifs.length > 0)
    .map((theme, i) => optionTemplate('theme', theme.id, `${theme.icon} ${theme.label}`, i === 0))
    .join('');
}

/** Radioliste fuer die Spieleranzahl. */
function playerCountOptionsTemplate(): string {
  return PLAYER_COUNTS
    .map((entry, i) => optionTemplate('playerCount', String(entry.value), entry.label, i === 1))
    .join('');
}

/** Radioliste fuer die Spielfeldgroesse. */
function boardSizeOptionsTemplate(): string {
  return BOARD_SIZES
    .map((size, i) => optionTemplate('boardSize', size.value, size.label, i === 0))
    .join('');
}

function fieldsetTemplate(icon: string, legend: string, options: string): string {
  return `
    <fieldset class="settings__section">
      <legend>${icon} ${legend}</legend>
      <ul class="settings__options">${options}</ul>
    </fieldset>`;
}

/** Liefert das erste auswaehlbare Theme als Vorschau-Default. */
function firstTheme(): ThemeId {
  return Object.values(THEMES).find((theme) => theme.motifs.length > 0)!.id;
}

/** Live-Vorschau der beiden Karten fuer das aktuell gewaehlte Theme. */
function previewTemplate(themeId: ThemeId): string {
  const icon = THEMES[themeId].icon;
  return `
    <div class="settings__stage" id="preview-stage" data-theme="${themeId}">
      <div class="settings__preview-card">${icon}</div>
      <div class="settings__preview-card">${icon}</div>
    </div>`;
}

function formTemplate(): string {
  return `
    <form id="settings-form" class="settings__form">
      ${fieldsetTemplate('🎨', 'Game themes', themeOptionsTemplate())}
      ${fieldsetTemplate('👤', 'Players', playerCountOptionsTemplate())}
      ${fieldsetTemplate('▦', 'Board size', boardSizeOptionsTemplate())}
      <button type="submit" class="button button--primary">▶ Start</button>
    </form>`;
}

function previewPanelTemplate(): string {
  return `
    <div class="settings__preview">
      ${previewTemplate(firstTheme())}
      <p class="settings__breadcrumb">Game theme / Players / Board size</p>
    </div>`;
}

function settingsTemplate(): string {
  return `
    <div class="settings">
      <h1 class="settings__title">Settings</h1>
      <div class="settings__layout">${formTemplate()}${previewPanelTemplate()}</div>
    </div>`;
}

/** Aktualisiert die Vorschau, wenn ein anderes Theme gewaehlt wird. */
function bindPreviewUpdate(form: HTMLFormElement): void {
  form.addEventListener('change', () => {
    const themeId = new FormData(form).get('theme') as ThemeId;
    const stage = form.parentElement?.querySelector('#preview-stage');
    if (stage) stage.outerHTML = previewTemplate(themeId);
  });
}

function readSettings(form: HTMLFormElement): GameSettings {
  const data = new FormData(form);
  return {
    theme: data.get('theme') as ThemeId,
    boardSize: data.get('boardSize') as BoardSize,
    playerCount: Number(data.get('playerCount')) as PlayerCount,
  };
}

/** Rendert die Einstellungen in den Content-Bereich und startet das Spiel nach Bestaetigung. */
export function renderSettingsScreen(content: HTMLElement, onStart: (settings: GameSettings) => void): void {
  content.innerHTML = settingsTemplate();
  const form = content.querySelector('#settings-form') as HTMLFormElement;
  bindPreviewUpdate(form);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onStart(readSettings(form));
  });
}

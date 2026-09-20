import { THEMES, coverUrl, motifUrl } from '../config/theme.config';
import { gameBarTemplate } from '../game/gamebar.template';
import type { GameSettings, BoardSize, PlayerCount, ThemeId, PlayerColor } from '../models/theme.model';

interface Option {
  value: string;
  label: string;
  short: string;
}

const CRUMBS: { name: string; placeholder: string }[] = [
  { name: 'theme', placeholder: 'Game theme' },
  { name: 'playerCount', placeholder: 'Player' },
  { name: 'boardSize', placeholder: 'Board size' },
];
const PLAYER_OPTIONS: Option[] = [
  { value: '1', label: '1 Player (vs Computer)', short: '1 Player' },
  { value: '2', label: '2 Players', short: '2 Players' },
  { value: '3', label: '3 Players', short: '3 Players' },
  { value: '4', label: '4 Players', short: '4 Players' },
];
const SIZE_OPTIONS: Option[] = [
  { value: '4x4', label: '16 cards', short: '16 Cards' },
  { value: '4x6', label: '24 cards', short: '24 Cards' },
  { value: '6x6', label: '36 cards', short: '36 Cards' },
];

function optionTemplate(name: string, option: Option): string {
  const id = `${name}-${option.value}`;
  return `
    <li class="settings__option">
      <input type="radio" name="${name}" value="${option.value}" id="${id}" data-short="${option.short}" required>
      <label for="${id}">${option.label}</label>
    </li>`;
}

function themeOptions(): Option[] {
  return Object.values(THEMES)
    .filter((theme) => theme.motifs.length > 0)
    .map((theme) => ({ value: theme.id, label: theme.label, short: theme.label.replace(/ theme$/i, '') }));
}

function fieldsetTemplate(icon: string, legend: string, name: string, options: Option[]): string {
  return `
    <fieldset class="settings__section">
      <legend><img class="settings__icon" src="./images/icons/${icon}.svg" alt="">${legend}</legend>
      <ul class="settings__options">${options.map((option) => optionTemplate(name, option)).join('')}</ul>
    </fieldset>`;
}

function formTemplate(): string {
  return `
    <form id="settings-form" class="settings__form">
      ${fieldsetTemplate('palette', 'Game themes', 'theme', themeOptions())}
      ${fieldsetTemplate('player', 'Choose player', 'playerCount', PLAYER_OPTIONS)}
      ${fieldsetTemplate('board-size', 'Board size', 'boardSize', SIZE_OPTIONS)}
    </form>`;
}

/** Liefert das erste auswaehlbare Theme als Vorschau-Default. */
function firstTheme(): ThemeId {
  return Object.values(THEMES).find((theme) => theme.motifs.length > 0)!.id;
}

/** Live-Vorschau der beiden Karten und der Game Bar fuer das aktuell gewaehlte Theme. */
function previewTemplate(themeId: ThemeId): string {
  const motif = THEMES[themeId].previewMotif;
  const players: PlayerColor[] = ['blue', 'orange'];

  return `
    <div class="settings__stage" id="preview-stage" data-theme="${themeId}">
      ${gameBarTemplate(players, null)}
      <div class="settings__stage-cards">
        <img class="settings__preview-card" src=".${coverUrl(themeId)}" alt="">
        <img class="settings__preview-card" src=".${motifUrl(themeId, motif)}" alt="${motif.replace(/-/g, ' ')}">
      </div>
    </div>`;
}

function breadcrumbTemplate(): string {
  const crumbs = CRUMBS.map((crumb) => `<span class="settings__crumb" data-crumb="${crumb.name}">${crumb.placeholder}</span>`);
  return `
    <div class="settings__breadcrumb">
      ${crumbs.join('')}
      <button type="submit" form="settings-form" class="settings__start" disabled>
        <span class="settings__start-icon" aria-hidden="true"></span>Start
      </button>
    </div>`;
}

function settingsTemplate(): string {
  return `
    <main class="settings">
      <div class="settings__frame">
        <h1 class="settings__title">Settings</h1>
        ${formTemplate()}
        <div class="settings__preview">${previewTemplate(firstTheme())}${breadcrumbTemplate()}</div>
      </div>
    </main>`;
}

/** Zeigt gewaehlte Werte im Breadcrumb; nicht gewaehlte behalten ihren Platzhalter. */
function updateBreadcrumb(root: HTMLElement, form: HTMLFormElement): void {
  for (const crumb of CRUMBS) {
    const checked = form.querySelector<HTMLInputElement>(`input[name="${crumb.name}"]:checked`);
    const element = root.querySelector<HTMLElement>(`[data-crumb="${crumb.name}"]`)!;
    element.textContent = checked?.dataset.short ?? crumb.placeholder;
    element.classList.toggle('is-filled', Boolean(checked));
  }
}

/** Uebernimmt die Auswahl: Vorschau, Breadcrumb und Start-Button (erst aktiv, wenn alles gewaehlt ist). */
function syncSelection(root: HTMLElement, form: HTMLFormElement): void {
  const theme = new FormData(form).get('theme') as ThemeId | null;
  if (theme) root.querySelector('#preview-stage')!.outerHTML = previewTemplate(theme);
  updateBreadcrumb(root, form);
  root.querySelector<HTMLButtonElement>('.settings__start')!.disabled = !form.checkValidity();
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
  form.addEventListener('change', () => syncSelection(content, form));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.checkValidity()) onStart(readSettings(form));
  });
}

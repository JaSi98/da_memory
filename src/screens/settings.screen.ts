import { THEMES, coverUrl, motifUrl } from '../config/theme.config';
import { gameBarTemplate } from '../game/gamebar.template';
import type { GameSettings, BoardSize, PlayerCount, ThemeId, PlayerColor } from '../models/theme.model';

/**
 * One radio option of the settings form.
 */
interface Option {
  /** Value that is submitted with the form. */
  value: string;
  /** Text shown next to the radio button. */
  label: string;
  /** Short text shown in the breadcrumb. */
  short: string;
}

/** Breadcrumb entries: name of the radio group and its placeholder text. */
const CRUMBS: { name: string; placeholder: string }[] = [
  { name: 'theme', placeholder: 'Game theme' },
  { name: 'playerCount', placeholder: 'Player' },
  { name: 'boardSize', placeholder: 'Board size' },
];
/** Options of the player count group. */
const PLAYER_OPTIONS: Option[] = [
  { value: '1', label: '1 Player (vs Computer)', short: '1 Player' },
  { value: '2', label: '2 Players', short: '2 Players' },
  { value: '3', label: '3 Players', short: '3 Players' },
  { value: '4', label: '4 Players', short: '4 Players' },
];
/** Options of the board size group. */
const SIZE_OPTIONS: Option[] = [
  { value: '4x4', label: '16 cards', short: '16 Cards' },
  { value: '4x6', label: '24 cards', short: '24 Cards' },
  { value: '6x6', label: '36 cards', short: '36 Cards' },
];

/**
 * Builds a single radio option of the settings form.
 * @param name - Name of the radio group.
 * @param option - Option to render.
 * @returns HTML markup of the list item.
 */
function optionTemplate(name: string, option: Option): string {
  const id = `${name}-${option.value}`;
  return `
    <li class="settings__option">
      <input type="radio" name="${name}" value="${option.value}" id="${id}" data-short="${option.short}" required>
      <label for="${id}">${option.label}</label>
    </li>`;
}

/**
 * Lists all themes that can be selected (themes with at least one motif).
 * @returns Options for the theme group.
 */
function themeOptions(): Option[] {
  return Object.values(THEMES)
    .filter((theme) => theme.motifs.length > 0)
    .map((theme) => ({ value: theme.id, label: theme.label, short: theme.label.replace(/ theme$/i, '') }));
}

/**
 * Builds one section of the settings form with icon, heading and radio options.
 * @param icon - File name of the section icon without extension.
 * @param legend - Heading of the section.
 * @param name - Name of the radio group.
 * @param options - Options of the section.
 * @returns HTML markup of the fieldset.
 */
function fieldsetTemplate(icon: string, legend: string, name: string, options: Option[]): string {
  return `
    <fieldset class="settings__section">
      <legend><img class="settings__icon" src="./images/icons/${icon}.svg" alt="">${legend}</legend>
      <ul class="settings__options">${options.map((option) => optionTemplate(name, option)).join('')}</ul>
    </fieldset>`;
}

/**
 * Builds the settings form with all three sections.
 * @returns HTML markup of the form.
 */
function formTemplate(): string {
  return `
    <form id="settings-form" class="settings__form">
      ${fieldsetTemplate('palette', 'Game themes', 'theme', themeOptions())}
      ${fieldsetTemplate('player', 'Choose player', 'playerCount', PLAYER_OPTIONS)}
      ${fieldsetTemplate('board-size', 'Board size', 'boardSize', SIZE_OPTIONS)}
    </form>`;
}

/**
 * Finds the first selectable theme, used as default for the preview.
 * @returns Id of the first theme with motifs.
 */
function firstTheme(): ThemeId {
  return Object.values(THEMES).find((theme) => theme.motifs.length > 0)!.id;
}

/**
 * Builds the live preview with game bar and two sample cards for a theme.
 * @param themeId - Theme to preview.
 * @returns HTML markup of the preview stage.
 */
function previewTemplate(themeId: ThemeId): string {
  const motif = THEMES[themeId].previewMotif;
  const players: PlayerColor[] = ['blue', 'orange'];

  return `
    <figure class="settings__stage" id="preview-stage" data-theme="${themeId}">
      <figcaption class="visually-hidden">Preview of the theme</figcaption>
      ${gameBarTemplate(players, null, true)}
      <span class="settings__stage-cards">
        <img class="settings__preview-card" src=".${coverUrl(themeId)}" alt="">
        <img class="settings__preview-card" src=".${motifUrl(themeId, motif)}" alt="${motif.replace(/-/g, ' ')}">
      </span>
    </figure>`;
}

/**
 * Builds the breadcrumb that shows the chosen values and holds the start button.
 * @returns HTML markup of the breadcrumb.
 */
function breadcrumbTemplate(): string {
  const crumbs = CRUMBS.map((crumb) => `<li class="settings__crumb" data-crumb="${crumb.name}">${crumb.placeholder}</li>`);
  return `
    <nav class="settings__breadcrumb" aria-label="Your selection">
      <ol class="settings__crumbs">${crumbs.join('')}</ol>
      <button type="submit" form="settings-form" class="settings__start" disabled>
        <span class="settings__start-icon" aria-hidden="true"></span>Start
      </button>
    </nav>`;
}

/**
 * Builds the complete settings screen.
 * @returns HTML markup of the settings screen.
 */
function settingsTemplate(): string {
  return `
    <section class="settings" aria-labelledby="settings-title">
      <h1 id="settings-title" class="settings__title">Settings</h1>
      ${formTemplate()}
      <aside class="settings__preview" aria-label="Preview and summary">${previewTemplate(firstTheme())}${breadcrumbTemplate()}</aside>
    </section>`;
}

/**
 * Shows the chosen values in the breadcrumb; unchosen values keep their placeholder.
 * @param root - Element containing the breadcrumb.
 * @param form - Settings form to read the choices from.
 */
function updateBreadcrumb(root: HTMLElement, form: HTMLFormElement): void {
  for (const crumb of CRUMBS) {
    const checked = form.querySelector<HTMLInputElement>(`input[name="${crumb.name}"]:checked`);
    const element = root.querySelector<HTMLElement>(`[data-crumb="${crumb.name}"]`)!;
    element.textContent = checked?.dataset.short ?? crumb.placeholder;
    element.classList.toggle('is-filled', Boolean(checked));
  }
}

/**
 * Shows the preview of a theme. Nothing is replaced if that theme is already shown.
 * @param root - Element containing the settings screen.
 * @param theme - Theme to show in the preview.
 */
function showPreview(root: HTMLElement, theme: ThemeId): void {
  const stage = root.querySelector<HTMLElement>('#preview-stage')!;
  if (stage.dataset.theme !== theme) stage.outerHTML = previewTemplate(theme);
}

/**
 * Reads the selected theme of the form.
 * @param form - Settings form to read the choice from.
 * @returns The selected theme, or the default theme if none is selected yet.
 */
function selectedTheme(form: HTMLFormElement): ThemeId {
  return (new FormData(form).get('theme') as ThemeId | null) ?? firstTheme();
}

/**
 * Shows the theme under the mouse in the preview. Hovering any other option shows the selected theme again.
 * @param root - Element containing the settings screen.
 * @param form - Settings form to read the choices from.
 * @param event - Mouseover event of the form.
 */
function previewHover(root: HTMLElement, form: HTMLFormElement, event: MouseEvent): void {
  const input = (event.target as HTMLElement).closest('.settings__option')?.querySelector('input');
  const isTheme = input?.name === 'theme';
  showPreview(root, isTheme ? (input!.value as ThemeId) : selectedTheme(form));
}

/**
 * Applies the current choices to preview, breadcrumb and start button. The start button is enabled once everything is chosen.
 * @param root - Element containing the settings screen.
 * @param form - Settings form to read the choices from.
 */
function syncSelection(root: HTMLElement, form: HTMLFormElement): void {
  showPreview(root, selectedTheme(form));
  updateBreadcrumb(root, form);
  root.querySelector<HTMLButtonElement>('.settings__start')!.disabled = !form.checkValidity();
}

/**
 * Reads the chosen values out of the settings form.
 * @param form - Completely filled settings form.
 * @returns The game settings.
 */
function readSettings(form: HTMLFormElement): GameSettings {
  const data = new FormData(form);
  return {
    theme: data.get('theme') as ThemeId,
    boardSize: data.get('boardSize') as BoardSize,
    playerCount: Number(data.get('playerCount')) as PlayerCount,
  };
}

/**
 * Renders the settings screen and starts the game after confirmation.
 * @param content - Container element that receives the screen.
 * @param onStart - Called with the chosen settings when the form is submitted.
 */
export function renderSettingsScreen(content: HTMLElement, onStart: (settings: GameSettings) => void): void {
  content.innerHTML = settingsTemplate();
  const form = content.querySelector('#settings-form') as HTMLFormElement;
  form.addEventListener('change', () => syncSelection(content, form));
  form.addEventListener('mouseover', (event) => previewHover(content, form, event));
  form.addEventListener('mouseleave', () => showPreview(content, selectedTheme(form)));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.checkValidity()) onStart(readSettings(form));
  });
}

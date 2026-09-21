import type { ThemeId, ThemeConfig } from '../models/theme.model';

/** All themes by id. */
export const THEMES: Record<ThemeId, ThemeConfig> = {
  'code-vibes': {
    id: 'code-vibes',
    label: 'Code vibes theme',
    previewMotif: 'git',
    motifs: ['git', 'typescript', 'javascript', 'html5', 'vscode', 'django',
             'css3', 'angular', 'terminal', 'python', 'github', 'node',
             'bootstrap', 'vue', 'react', 'sass', 'sql', 'firebase'],
  },
  gaming: {
    id: 'gaming',
    label: 'Gaming theme',
    previewMotif: 'dice',
    motifs: ['circle-guard', 'square-guard', 'triangle-guard', 'labyrinth', 'creeper', 'mushroom',
             'dice', 'banana', 'gamepad', 'ghosts', 'coin', 'spiral',
             'level-up', 'pacman', 'handheld', 'puzzle', 'playing-card', 'play-button'],
  },
  'da-projects': {
    id: 'da-projects',
    label: 'DA Projects theme',
    previewMotif: 'shark',
    motifs: ['noodles', 'ramen', 'egg', 'blossom', 'join', 'chef-hat',
             'recycle', 'basket', 'pokeball', 'tic-tac-toe', 'smiley', 'arrow',
             'chat', 'sombrero', 'broccoli', 'network', 'shark', 'coins'],
  },
  foods: {
    id: 'foods',
    label: 'Foods theme',
    previewMotif: 'wrap',
    motifs: ['fries', 'pizza', 'sandwich', 'donut', 'sushi', 'corn-dog',
             'burger', 'pretzel', 'cupcake', 'pudding', 'flan', 'chocolate',
             'fried-chicken', 'wrap', 'taco', 'ice-cream', 'salad', 'macarons'],
  },
};

/**
 * Builds the path of the cover image (hidden card side) of a theme.
 * @param theme - Theme the cover belongs to.
 * @returns Path of the cover SVG.
 */
export function coverUrl(theme: ThemeId): string {
  return `/images/${theme}/cover.svg`;
}

/**
 * Builds the path of a motif image (revealed card side) of a theme.
 * @param theme - Theme the motif belongs to.
 * @param motif - File name of the motif without extension.
 * @returns Path of the motif SVG.
 */
export function motifUrl(theme: ThemeId, motif: string): string {
  return `/images/${theme}/${motif}.svg`;
}

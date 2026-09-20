import type { ThemeId, ThemeConfig } from '../models/theme.model';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'code-vibes': {
    id: 'code-vibes',
    label: 'Code vibes theme',
    icon: '💻',
    previewMotif: 'git',
    motifs: ['git', 'typescript', 'javascript', 'html5', 'vscode', 'django',
             'css3', 'angular', 'terminal', 'python', 'github', 'node',
             'bootstrap', 'vue', 'react', 'sass', 'sql', 'firebase'],
  },
  gaming: {
    id: 'gaming',
    label: 'Gaming theme',
    icon: '🎮',
    previewMotif: 'dice',
    motifs: ['circle-guard', 'square-guard', 'triangle-guard', 'labyrinth', 'creeper', 'mushroom',
             'dice', 'banana', 'gamepad', 'ghosts', 'coin', 'spiral',
             'level-up', 'pacman', 'handheld', 'puzzle', 'playing-card', 'play-button'],
  },
  'da-projects': {
    id: 'da-projects',
    label: 'DA Projects theme',
    icon: '🗂️',
    previewMotif: 'shark',
    motifs: ['noodles', 'ramen', 'egg', 'blossom', 'join', 'chef-hat',
             'recycle', 'basket', 'pokeball', 'tic-tac-toe', 'smiley', 'arrow',
             'chat', 'sombrero', 'broccoli', 'network', 'shark', 'coins'],
  },
  foods: {
    id: 'foods',
    label: 'Foods theme',
    icon: '🍔',
    previewMotif: 'wrap',
    motifs: ['fries', 'pizza', 'sandwich', 'donut', 'sushi', 'corn-dog',
             'burger', 'pretzel', 'cupcake', 'pudding', 'flan', 'chocolate',
             'fried-chicken', 'wrap', 'taco', 'ice-cream', 'salad', 'macarons'],
  },
};

/** Pfad zum Cover-SVG (verdeckte Kartenseite) eines Themes. */
export function coverUrl(theme: ThemeId): string {
  return `/images/${theme}/cover.svg`;
}

/** Pfad zum Motiv-SVG (aufgedeckte Kartenseite) eines Themes. */
export function motifUrl(theme: ThemeId, motif: string): string {
  return `/images/${theme}/${motif}.svg`;
}

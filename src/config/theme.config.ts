import type { ThemeId, ThemeConfig } from '../models/theme.model';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'code-vibes': {
    id: 'code-vibes',
    label: 'Code vibes',
    icon: '💻',
    motifs: ['angular', 'typescript', 'javascript', 'html5', 'vscode', 'css3',
             'django', 'git', 'terminal', 'python', 'github', 'node',
             'bootstrap', 'vue', 'react', 'sass', 'sql', 'firebase'],
  },
  gaming: {
    id: 'gaming',
    label: 'Gaming',
    icon: '🎮',
    motifs: ['controller', 'dice', 'trophy', 'medal', 'target', 'rocket',
             'star', 'heart', 'gem', 'shield', 'swords', 'coin',
             'ghost', 'mushroom', 'joystick', 'puzzle', 'crown', 'lightning'],
  },
  'da-projects': {
    id: 'da-projects',
    label: 'DA Projects',
    icon: '🗂️',
    motifs: ['folder', 'chart', 'archive', 'calculator', 'desktop', 'mouse',
             'keyboard', 'wrench', 'tools', 'toolbox', 'graph', 'ruler',
             'flask', 'plug', 'disk', 'cabinet', 'clipboard', 'printer'],
  },
  foods: {
    id: 'foods',
    label: 'Foods',
    icon: '🍔',
    motifs: ['burger', 'pizza', 'fries', 'hotdog', 'donut', 'cookie',
             'icecream', 'chocolate', 'popcorn', 'croissant', 'apple', 'banana',
             'grapes', 'watermelon', 'cherries', 'cake', 'cupcake', 'avocado'],
  },
};
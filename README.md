# Memory

A memory card game for the browser, built as a project of the Developer Akademie.
It is written entirely in TypeScript and SCSS (Vite as build tool, no frameworks) and implements the Figma design with four themes.

Repository: https://github.com/JaSi98/da_memory

## Contents

- [Features](#features)
- [Extras](#extras)
- [How to play](#how-to-play)
- [Installation and start](#installation-and-start)
- [Project structure](#project-structure)
- [Technical overview](#technical-overview)
- [Adding a new theme](#adding-a-new-theme)
- [Coding conventions](#coding-conventions)
- [Notes and limitations](#notes-and-limitations)

## Features

The implementation follows the user stories of the project checklist.

**Home screen**
- Home screen as specified in Figma, with a play button that leads to the settings.
- On hover, the controller inside the button grows and rotates, and the arrow gets thicker.
- A large controller as a subtle decoration in the background.

**Settings**
- Choice of theme, number of players (1 to 4) and board size (16, 24 or 36 cards, which means 4x4, 4x6 and 6x6).
- Exactly one option can be selected per group. The yellow marker slides in on hover and on selection.
- Live preview with game bar and two sample cards that changes with the selected theme.
- The breadcrumb shows the current choices. The start button becomes active once all three settings are chosen.

**Themes**
- Four themes: Code vibes, Gaming, DA Projects and Foods.
- Every theme has 18 motifs of its own, its own card back design, its own typeface and its own game bar.
- The theme changes the color scheme and the motifs of the whole game, including the end screen.

**Board**
- The board matches the selected size.
- Above the board are the scores, the current player and an "Exit game" button with a confirmation dialog.
- Cards flip with a 3D animation.
- Found pairs are highlighted in the color of the player who found them.

**End of a round**
- A "Game over" view with counting final scores, followed by the result with the winner or a draw.
- A win comes with confetti cannons, falling confetti and fireworks that match the theme.
- "Back to start" or "Home" returns to the home screen so a new round can begin.

## Extras

- **Up to four players.** With one player you play against the computer.
- **Computer opponent with memory.** It remembers every revealed card, plays known pairs directly and otherwise prefers cards it has not seen yet.
- **Sound effects** for flipping, matching, missing, winning, drawing and fireworks. They are synthesized with the Web Audio API, no audio files are loaded.
- **Theme based end screens** with their own animations. On a draw a scale swings back and forth, and there are deliberately no fireworks.
- **Scaling based on the Figma frame (1440 x 1024).** All sizes are calculated relative to this frame, so even 36 cards fit on screen without a scrollbar. From 1440 pixels width on, the content stays centered and the background fills the whole width.
- **Reduced motion.** With the system setting "prefers-reduced-motion" enabled, the animations of the end screen run only minimally and the fireworks are skipped.

## How to play

1. Click "Play" on the home screen.
2. Choose theme, number of players and board size in the settings and click "Start".
3. The first player is always Blue. One click reveals a card, a second click reveals the second card.
4. If both cards match, the player scores a point and goes again. If they do not match, they are turned back over and the next player is up.
5. When all pairs are found, the round ends. The player with the most points wins. Equal scores result in a draw.

With one player, Orange is the computer. It moves automatically when it is its turn.

## Installation and start

A current Node.js version (LTS) with npm is required.

```bash
# Install dependencies
npm install

# Start the development server (default: http://localhost:5173)
npm run dev

# Type check and production build into dist/
npm run build

# Preview the built version locally
npm run preview
```

The build uses `--base=./`, so the app can also be hosted in a subfolder, for example on GitHub Pages.

## Project structure

```
index.html                  Entry page (container #content, fonts, favicon)
public/
  favicon.svg
  images/
    code-vibes/ gaming/     Per theme: cover.svg and 18 motifs (SVG)
    da-projects/ foods/
    icons/                  UI icons (controller, pawn, label, exit, ...)
    end/                    End screen graphics (title, trophy, scale, confetti)
src/
  main.ts                   Entry point and flow between the screens
  models/                   Data types (card, theme, settings)
  config/                   Themes, player colors, image paths
  services/                 Deck shuffling, sound, confetti and fireworks
  game/                     Game logic, scores, templates for board and game bar
  screens/                  Home, settings, exit popup and end screen
  styles/                   SCSS in the 7-1 pattern
    abstracts/              Variables and the helper function u()
    base/                   Reset and base styles
    components/             Buttons, cards, board, game bar, popup
    pages/                  Home, settings, game, end screen
```

## Technical overview

**Single page app without a framework.** `main.ts` controls the flow home, settings, game and end screen. Every screen renders through a template function into the container `#content`. Screens are switched with callbacks and the page is never reloaded.

**Separation of logic and presentation.**
- `game.ts` holds state and rules (revealing, pair check, turn change, computer turn).
- `score.ts` manages the points and the active player.
- The HTML templates live in their own functions and files, and the look is defined entirely in SCSS.

**Theme system.** The active theme is set as the attribute `data-theme` on the root element of a screen. SCSS maps per theme are written out as CSS variables with `@each` (colors, typefaces, card dimensions, game bar look). This way every screen has a single markup and the theme decides how it looks.

**Scaling.** Every screen sets `--s` as the ratio of the window to the Figma frame. The SCSS function `u(24)` converts Figma pixels into `calc(24 * var(--s))`. All measurements from the design can therefore be used unchanged.

**Computer opponent.** All revealed cards are stored in a memory list. At the start of a turn the computer looks for a fully known pair in that list. If there is none, it reveals a card and uses the known partner for the second card, if one exists.

**Effects.** The fireworks and confetti cannons are a particle system on a canvas (`effects.service.ts`). Each theme brings its own colors and shapes, for example code symbols for Code vibes or food stickers for Foods.

**Typefaces** are loaded from Google Fonts: Red Rose, Orbitron, Figtree, Klee One, Delius Unicase, Almarai and Poppins.

## Adding a new theme

1. Create the folder `public/images/<theme-id>/` with `cover.svg` and the motifs as SVG files.
2. Add the new id to the type `ThemeId` in `src/models/theme.model.ts`.
3. Register the theme in `src/config/theme.config.ts` with label, preview motif and the file names of the motifs. The largest board size needs 18 motifs.
4. Add one entry for the theme to each SCSS map: `$bar-themes` (game bar), `$game-themes` (cards and page color), `$stage-themes` (settings preview) and `$end-themes` (end screen).
5. Optionally add colors and shapes for the fireworks in `effects.service.ts`.

## Coding conventions

The code follows the guidelines of the Developer Akademie (folder `Guidelines`):

- File names in kebab-case, functions and variables in camelCase, classes and types in PascalCase, constants in UPPER_CASE.
- At most 14 lines per function, one task per function.
- Types and return values are stated explicitly, no `any`.
- HTML lives in template functions instead of being scattered through the code, and semantic tags are used (`main`, `header`, `section`, `form`, `fieldset`, `button`).
- Images have meaningful `alt` texts, decorative elements are marked with `aria-hidden`.
- SCSS in the 7-1 pattern with partials, `@use`, nesting, BEM names, and maps with `@each` for themes.

## Notes and limitations

- An internet connection is needed for the typefaces. Without it, fallback fonts are used.
- Browsers only start audio after a user action, so the sounds begin with the first click.
- The layout is designed for desktop screens. On very small screens everything is scaled down proportionally.
- All motifs, covers and icons come from the Figma design of the project and were exported from there as SVG.

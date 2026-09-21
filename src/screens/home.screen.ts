const ARROW = `
  <svg class="home__arrow" viewBox="0 0 33 16" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M0 8H31M24 1L31 8L24 15"></path>
  </svg>`;

/**
 * Builds the markup of the home screen.
 * @returns HTML markup of the home screen.
 */
function homeTemplate(): string {
  return `
    <main class="home">
      <div class="home__stage">
        <span class="home__decor" aria-hidden="true"></span>
        <header class="home__intro">
          <p class="home__hello">It's play time.</p>
          <h1 class="home__title">Ready to play?</h1>
        </header>
        <button id="play-btn" class="home__play" type="button">
          <span class="home__play-box"><span class="home__play-icon" aria-hidden="true"></span></span>
          <span class="home__play-label">Play</span>
          ${ARROW}
        </button>
      </div>
    </main>`;
}

/**
 * Renders the home screen and wires the play button.
 * @param content - Container element that receives the screen.
 * @param onPlay - Called when the play button is clicked.
 */
export function renderHomeScreen(content: HTMLElement, onPlay: () => void): void {
  content.innerHTML = homeTemplate();
  content.querySelector('#play-btn')?.addEventListener('click', onPlay);
}

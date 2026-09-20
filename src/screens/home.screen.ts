function homeTemplate(): string {
  return `
    <main class="home">
      <span class="home__icon" aria-hidden="true">🎮</span>
      <p class="home__intro">It's play time.</p>
      <h1 class="home__title">Ready to play?</h1>
      <button id="play-btn" class="button button--primary" type="button">
        🎮 Play →
      </button>
    </main>`;
}

/** Rendert den Homescreen und startet die Einstellungen per Play-Button. */
export function renderHomeScreen(content: HTMLElement, onPlay: () => void): void {
  content.innerHTML = homeTemplate();
  content.querySelector('#play-btn')?.addEventListener('click', onPlay);
}

/**
 * Builds the markup of the exit confirmation dialog.
 * @returns HTML markup of the dialog overlay.
 */
function popupTemplate(): string {
  return `
    <div class="popup-overlay" id="exit-popup">
      <div class="popup">
        <p class="popup__title">Are you sure you want to quit the game?</p>
        <div class="popup__actions">
          <button class="button button--secondary" id="popup-resume" type="button">Back to game</button>
          <button class="button button--outline" id="popup-exit" type="button">Exit game</button>
        </div>
      </div>
    </div>`;
}

/**
 * Shows the exit confirmation as an overlay above the board.
 * @param content - Container element the overlay is added to.
 * @param onExit - Called when the user confirms leaving the game.
 */
export function showExitPopup(content: HTMLElement, onExit: () => void): void {
  content.insertAdjacentHTML('beforeend', popupTemplate());
  const overlay = content.querySelector('#exit-popup') as HTMLElement;
  overlay.querySelector('#popup-resume')?.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#popup-exit')?.addEventListener('click', onExit);
}

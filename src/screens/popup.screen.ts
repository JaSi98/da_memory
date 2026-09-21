/**
 * Builds the markup of the exit confirmation dialog.
 * @returns HTML markup of the dialog.
 */
function popupTemplate(): string {
  return `
    <dialog class="popup" id="exit-popup" aria-labelledby="exit-popup-title">
      <h2 id="exit-popup-title" class="popup__title">Are you sure you want to quit the game?</h2>
      <menu class="popup__actions">
        <li><button class="button button--secondary" id="popup-resume" type="button">Back to game</button></li>
        <li><button class="button button--outline" id="popup-exit" type="button">Exit game</button></li>
      </menu>
    </dialog>`;
}

/**
 * Shows the exit confirmation as a modal dialog above the board.
 * @param content - Container element the dialog is added to.
 * @param onExit - Called when the user confirms leaving the game.
 */
export function showExitPopup(content: HTMLElement, onExit: () => void): void {
  content.insertAdjacentHTML('beforeend', popupTemplate());
  const dialog = content.querySelector('#exit-popup') as HTMLDialogElement;
  dialog.showModal();
  dialog.addEventListener('close', () => dialog.remove());
  dialog.querySelector('#popup-resume')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('#popup-exit')?.addEventListener('click', onExit);
}

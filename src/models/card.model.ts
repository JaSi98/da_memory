/**
 * A single memory card. Both cards of a pair share the same pair id.
 */
export class Card {
  /** True while the card lies face up. */
  public isFlipped = false;

  /** True once the card belongs to a found pair. */
  public isMatched = false;

  /**
   * Creates a card.
   * @param id - Unique id of the card on the board.
   * @param pairId - Id shared by both cards of a pair.
   * @param label - Readable name of the motif, used as alternative text.
   * @param imageUrl - Path of the motif image.
   */
  constructor(
    public readonly id: number,
    public readonly pairId: number,
    public readonly label: string,
    public readonly imageUrl: string
  ) {}
}

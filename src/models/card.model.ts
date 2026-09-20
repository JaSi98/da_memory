export class Card {
  public isFlipped = false;
  public isMatched = false;

  constructor(
    public readonly id: number,
    public readonly pairId: number,
    public readonly label: string,
    public readonly imageUrl: string
  ) {}
}
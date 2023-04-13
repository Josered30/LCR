export class Player {
  constructor(public index: number, public chipsCount: number, public winner = false) {}

  addChip() {
    this.chipsCount += 1;
  }

  removeChip() {
    this.chipsCount -= 1;
  }
}

import { GameRuleEnum } from './game-rules.enum';
import { Player } from './player';

export class GameController {
  public centerPile: number;
  public players: Player[];
  public currentPlayerIndex: number;

  private readonly validationRegex: RegExp;
  private readonly initialChips: number;

  constructor() {
    this.players = [];
    this.initialChips = 3;
    this.centerPile = 0;
    this.currentPlayerIndex = 0;
    this.validationRegex = /^[LR\.C]*$/gm;
  }

  initGame(playerCount: number): void {
    this.players = Array.from(Array(playerCount), (_, index: number) => new Player(index, this.initialChips));
  }

  playGame(rolls: string): void {
    let parsedRoll = rolls.toUpperCase();

    if (!this.validateRolls(parsedRoll)) {
      return;
    }

    while (true) {
      const player = this.players[this.currentPlayerIndex];

      const parsedRollList = parsedRoll.split('');
      const currentRollList = parsedRollList.splice(0, player.chipsCount > 3 ? 3 : player.chipsCount);
      parsedRoll = parsedRollList.join('');

      currentRollList.forEach((roll) => {
        switch (roll) {
          case GameRuleEnum.PASS_LEFT:
            let leftPlayerIndex = this.currentPlayerIndex + 1;
            if (leftPlayerIndex >= this.players.length) {
              leftPlayerIndex = leftPlayerIndex % (this.players.length - 1);
            }

            this.players[this.currentPlayerIndex].removeChip();
            this.players[leftPlayerIndex].addChip();

            break;
          case GameRuleEnum.PASS_RIGHT:
            const rightPlayerIndex = this.currentPlayerIndex - 1;

            this.players.at(this.currentPlayerIndex)?.removeChip();
            this.players.at(rightPlayerIndex)?.addChip();
            break;
          case GameRuleEnum.PASS_CENTER:
            this.players[this.currentPlayerIndex].removeChip();
            this.centerPile += 1;
            break;
          case GameRuleEnum.NONE:
            break;
        }
      });

      if (this.currentPlayerIndex + 1 >= this.players.length) {
        this.currentPlayerIndex = 0;
      } else {
        this.currentPlayerIndex += 1;
      }

      if (this.checkFinish() || parsedRoll.length === 0) {
        return;
      }
    }
  }

  private checkFinish(): boolean {
    let zeroCount = 0;

    this.players.forEach((player) => {
      if (player.chipsCount === 0) {
        zeroCount += 1;
      }
    });

    if (zeroCount === this.players.length) {
      return true;
    }

    if (zeroCount === this.players.length - 1) {
      const winner = this.players.find((player) => player.chipsCount > 0);
      console.log(winner);
      if (winner) {
        winner.winner = true;
      }
      return true;
    }

    return false;
  }

  private validateRolls(value: string) {
    return this.validationRegex.test(value);
  }
}

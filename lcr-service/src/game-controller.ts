import { Game } from './models/game';
import { GameRuleEnum } from './models/game-rules.enum';
import { Player } from './models/player';

import { v4 as uuid } from 'uuid';

export class GameController {
  public gameUuid: string;
  public centerPile: number;
  public currentPlayerIndex: number;
  public winnerPlayerIndex: number;

  public players: Player[];

  private readonly validationRegex: RegExp;
  private readonly initialChips: number;

  constructor() {
    this.players = [];
    this.initialChips = 3;
    this.centerPile = 0;
    this.currentPlayerIndex = 0;
    this.winnerPlayerIndex = 0;

    this.gameUuid = uuid();
    // eslint-disable-next-line no-useless-escape
    this.validationRegex = /^[LR\.C]*$/gm;
  }

  initGame(playerCount: number): void {
    this.players = Array.from(
      Array(playerCount),
      (_, index: number) => new Player(index, this.initialChips, this.gameUuid),
    );
  }

  playGame(rolls: string): void {
    let parsedRoll = rolls.toUpperCase();

    if (!this.validateRolls(parsedRoll)) {
      return;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const player = this.players[this.currentPlayerIndex];

      const parsedRollList = parsedRoll.split('');
      const currentRollList = parsedRollList.splice(0, player.chipsCount > 3 ? 3 : player.chipsCount);
      parsedRoll = parsedRollList.join('');

      currentRollList.forEach((roll) => {
        switch (roll) {
          case GameRuleEnum.PASS_LEFT: {
            let leftPlayerIndex = this.currentPlayerIndex + 1;

            if (leftPlayerIndex >= this.players.length) {
              leftPlayerIndex = leftPlayerIndex % (this.players.length - 1);
            }

            this.players[this.currentPlayerIndex].removeChip();
            this.players[leftPlayerIndex].addChip();

            break;
          }
          case GameRuleEnum.PASS_RIGHT: {
            const rightPlayerIndex = this.currentPlayerIndex - 1;

            this.players.at(this.currentPlayerIndex)?.removeChip();
            this.players.at(rightPlayerIndex)?.addChip();
            break;
          }
          case GameRuleEnum.PASS_CENTER: {
            this.players[this.currentPlayerIndex].removeChip();
            this.centerPile += 1;
            break;
          }
          case GameRuleEnum.NONE: {
            break;
          }
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
      const winnerIndex = this.players.findIndex((player) => player.chipsCount > 0);
      if (winnerIndex !== -1) {
        this.players[winnerIndex].winner = true;
        this.winnerPlayerIndex = winnerIndex;
      }
      return true;
    }

    return false;
  }

  private validateRolls(value: string) {
    return this.validationRegex.test(value);
  }

  get game() {
    return new Game(this.gameUuid, this.winnerPlayerIndex, this.currentPlayerIndex);
  }
}

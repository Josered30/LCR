import { Game } from './game';
import { Player } from './player';

export class GameData {
  constructor(public readonly game: Game, public readonly players: Player[]) {}
}

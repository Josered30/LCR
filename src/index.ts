import { GameController } from './game-controller';

import readline from 'readline/promises';

type GameOptions = {
  playerCount: number;
  rolls: string;
};

async function userInput(): Promise<GameOptions[]> {
  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const gameOptions: GameOptions[] = [];
  // eslint-disable-next-line no-useless-escape
  const inputValidationRegex = /^\d\s[LR\.C]*$/gm;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = (await read.question('')).toUpperCase();
    if (response === '0') {
      break;
    }

    if (!inputValidationRegex.test(response)) {
      console.log('Not valid input');
      continue;
    }

    const [playerCount, rolls] = response.split(' ');
    gameOptions.push({
      playerCount: Math.floor(Number.parseInt(playerCount)),
      rolls,
    });
  }

  read.close();
  return gameOptions;
}

async function main(): Promise<void> {
  const gameOptions = await userInput();

  gameOptions.forEach((gameOption, index) => {
    const gameController = new GameController();

    gameController.initGame(gameOption.playerCount);
    gameController.playGame(gameOption.rolls);

    console.log(`\nGame ${index + 1}:`);

    gameController.players.forEach((player, playerIndex) => {
      let state = '';

      if (playerIndex === gameController.currentPlayerIndex) {
        state = '(*)';
      }

      if (player.winner) {
        state = '(W)';
      }

      console.log(`Player ${player.index}: ${player.chipsCount}${state}`);
    });
  });
}

main();

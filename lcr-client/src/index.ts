import { GameController } from './game-controller';
import { RedisService } from './services/redis.service';

import { GameData } from './models/game-data';

import readline from 'readline/promises';
import * as dotenv from 'dotenv';
import { EventBridgeService } from './services/event-bridge.service';

dotenv.config();

const END_TOKEN = '0';
const GAME_OPTIONS_KEY = 'game_options_key';

type GameOptions = {
  playerCount: number;
  rolls: string;
};

async function saveGameOptions(): Promise<void> {
  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const gameOptions: GameOptions[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
  
    // eslint-disable-next-line no-useless-escape
    const inputValidationRegex = /^\d\s[LR\.C]*$/gm;
    const response = (await read.question('Input: ')).toUpperCase().trim();
    if (response === END_TOKEN) {
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

  const redisService = new RedisService();
  await redisService.client.connect();
  const redisTasks = gameOptions.map((gameOptions) =>
    redisService.client.lPush(GAME_OPTIONS_KEY, JSON.stringify(gameOptions)),
  );

  await Promise.all(redisTasks);
  await redisService.client.disconnect();
}

async function fetchGameOptions(): Promise<GameOptions[]> {
  const redisService = new RedisService();

  await redisService.client.connect();

  const gameOptionsLength = await redisService.client.lLen(GAME_OPTIONS_KEY);
  const gameOptionsString = await redisService.client.lRange(GAME_OPTIONS_KEY, 0, gameOptionsLength);

  redisService.client.del(GAME_OPTIONS_KEY);

  return gameOptionsString.map((value) => JSON.parse(value));
}

async function main(): Promise<void> {
  const eventBridgeService = new EventBridgeService();

  await saveGameOptions();

  const gameOptions = await fetchGameOptions();
  const gameData: GameData[] = [];

  gameOptions.forEach(async (gameOption, index) => {
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

    gameData.push(new GameData(gameController.game, gameController.players));
    await eventBridgeService.sendSQSMessage(gameData);
  });
}

main();

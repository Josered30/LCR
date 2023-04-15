import { PlayerResponsitory } from './repositories/player.repository';
import { GameRepository } from './repositories/game.respository';

import { DynamoService } from './services/dynamo.service';
import { SqsService } from './services/sqs.service';
import { GameData } from './models/game-data';

import { Message } from '@aws-sdk/client-sqs';

import * as dotenv from 'dotenv';

dotenv.config();

function delay(timeout: number) {
  return new Promise<void>((resolve, _) => {
    setTimeout(() => resolve(), timeout);
  });
}

async function main(): Promise<void> {
  console.log('Service init');

  const dynamoService = new DynamoService();
  const sqsService = new SqsService();

  const playerRespository = new PlayerResponsitory(dynamoService);
  const gameRepository = new GameRepository(dynamoService);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log('Get Messages');
    const receiveMessageOutput = await sqsService.getMessages();
    if (!receiveMessageOutput.Messages) {
      continue;
    }

    const gameData: GameData[] = [];
    const messages: Array<{ id: string; receiptHandler: string }> = [];

    receiveMessageOutput.Messages.forEach((message: Message) => {
      if (!message.Body) {
        return;
      }

      if (message.MessageId && message.ReceiptHandle) {
        messages.push({ id: message.MessageId, receiptHandler: message.ReceiptHandle });
      }

      const body = JSON.parse(message.Body);
      body.detail.value.forEach((value: GameData) => gameData.push(value));
    });

    sqsService.deleteMessages(messages);
    console.log(gameData);

    const players = gameData.flatMap((game) => game.players);
    const games = gameData.flatMap((game) => game.game);

    await playerRespository.savePlayers(players);
    await gameRepository.saveGames(games);

    delay(5000);
  }
}

main();

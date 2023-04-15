import { BatchWriteItemCommand, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { Game } from '../models/game';
import { DynamoService } from '../services/dynamo.service';

export class GameRepository {
  constructor(private readonly dynamoService: DynamoService) {}

  saveGame(game: Game) {
    const putItemsCommand = new PutItemCommand({
      TableName: 'Game',
      Item: {
        Id: {
          S: game.gameUuid,
        },
        WinnerPlayerIndex: {
          N: game.winnerPlayerIndex.toString(),
        },
        CurrentPlayerIndex: {
          N: game.currentPlayerIndex.toString(),
        },
      },
    });

    return this.dynamoService.client.send(putItemsCommand);
  }

  saveGames(games: Game[]) {
    const batchWriteItems = new BatchWriteItemCommand({
      RequestItems: {
        Game: games.map((game) => ({
          PutRequest: {
            Item: {
              Id: {
                S: game.gameUuid,
              },
              WinnerPlayerIndex: {
                N: game.winnerPlayerIndex.toString(),
              },
              CurrentPlayerIndex: {
                N: game.currentPlayerIndex.toString(),
              },
            },
          },
        })),
      },
    });

    return this.dynamoService.client.send(batchWriteItems);
  }

  getGames(gameUuid: string) {
    const queryCommand = new ScanCommand({
      TableName: 'Game',
      FilterExpression: 'Id = :gameId',
      ExpressionAttributeValues: {
        ':gameId': {
          S: gameUuid,
        },
      },
    });

    return this.dynamoService.client.send(queryCommand);
  }
}

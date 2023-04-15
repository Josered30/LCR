import { BatchWriteItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoService } from '../services/dynamo.service';
import { Player } from '../models/player';

import { v4 as uuid } from 'uuid';

export class PlayerResponsitory {
  constructor(private readonly dynamoService: DynamoService) {}

  savePlayer(player: Player) {
    const putItemsCommand = new PutItemCommand({
      TableName: 'Player',
      Item: {
        Id: {
          S: uuid(),
        },
        GameId: {
          S: player.gameUuid,
        },
        ChipsCount: {
          N: player.chipsCount.toString(),
        },
        Index: {
          N: player.index.toString(),
        },
      },
    });

    return this.dynamoService.client.send(putItemsCommand);
  }

  savePlayers(players: Player[]) {
    const batchWriteItems = new BatchWriteItemCommand({
      RequestItems: {
        Player: players.map((player) => ({
          PutRequest: {
            Item: {
              Id: {
                S: uuid(),
              },
              GameId: {
                S: player.gameUuid,
              },
              ChipsCount: {
                N: player.chipsCount.toString(),
              },
              Index: {
                N: player.index.toString(),
              },
            },
          },
        })),
      },
    });

    return this.dynamoService.client.send(batchWriteItems);
  }

  getPlayers(gameUuid: string) {
    const queryCommand = new QueryCommand({
      TableName: 'Player',
      IndexName: 'GameIndex',
      KeyConditionExpression: '#GameId = :gameId',
      ExpressionAttributeValues: {
        ':gameId': {
          S: gameUuid,
        },
      },
      ExpressionAttributeNames: {
        '#GameId': 'GameId',
      },
      ScanIndexForward: false,
    });

    return this.dynamoService.client.send(queryCommand);
  }
}

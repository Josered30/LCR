import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export class DynamoService {
  public readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY_ID as string,
        secretAccessKey: process.env.AWS_ACCESS_KEY as string,
      },
    });
  }
}

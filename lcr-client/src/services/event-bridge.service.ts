import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

export class EventBridgeService {
  private readonly eventBridgeClient: EventBridgeClient;

  constructor() {
    this.eventBridgeClient = new EventBridgeClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY_ID as string,
        secretAccessKey: process.env.AWS_ACCESS_KEY as string,
      },
    });
  }

  sendSQSMessage(value: any) {
    const putEventCommand = new PutEventsCommand({
      Entries: [
        {
          Source: 'lcr.events',
          DetailType: 'LcrEvent',
          Detail: JSON.stringify({ value }),
        },
      ],
    });

    return this.eventBridgeClient.send(putEventCommand);
  }
}

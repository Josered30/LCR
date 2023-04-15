import { DeleteMessageBatchCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

export class SqsService {
  private readonly sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY_ID as string,
        secretAccessKey: process.env.AWS_ACCESS_KEY as string,
      },
    });
  }

  getMessages(timeout = 10) {
    const receiveMessageCommand = new ReceiveMessageCommand({
      QueueUrl: process.env.AWS_SQS_QUEUE,
      WaitTimeSeconds: timeout,
    });

    return this.sqsClient.send(receiveMessageCommand);
  }

  deleteMessages(messages: Array<{ id: string; receiptHandler: string }>) {
    const deleteMessageBatchCommand = new DeleteMessageBatchCommand({
      QueueUrl: process.env.AWS_SQS_QUEUE,
      Entries: messages.map((message) => ({
        Id: message.id,
        ReceiptHandle: message.receiptHandler,
      })),
    });

    return this.sqsClient.send(deleteMessageBatchCommand);
  }
}

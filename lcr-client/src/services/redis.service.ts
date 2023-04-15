import { RedisClientType } from 'redis';
import { createClient } from 'redis';

export class RedisService {
  public readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
  }
}

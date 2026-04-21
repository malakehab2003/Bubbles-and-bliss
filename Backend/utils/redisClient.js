import { createClient } from 'redis';


export const redisConfig = {
  host: '127.0.0.1',
  port: 6379
};

class RedisClient {
  constructor() {
    this.client = createClient({
      socket: redisConfig
    });

    this.client.on('error', (err) => {
      console.log('Redis client error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('ready', () => {
      console.log('Redis client is ready');
    });

    this.client.on('end', () => {
      console.log('Redis client disconnected');
    });

    this.client.connect();
  }

  isAlive() {
    return this.client.isReady;
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, duration) {
    if (duration) {
      await this.client.set(key, value, { EX: duration });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key) {
    await this.client.del(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
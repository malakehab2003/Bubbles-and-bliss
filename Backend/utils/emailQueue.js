import { Queue } from 'bullmq';
import { redisConfig } from './redisClient.js';

export const emailQueue = new Queue('emailQueue', {
  connection: redisConfig
});
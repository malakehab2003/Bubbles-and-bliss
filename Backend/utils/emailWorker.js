import { Worker } from 'bullmq';
import { redisConfig } from './redisClient.js';
import { sendEmail } from './emailService.js';

const worker = new Worker(
  'emailQueue',
  async job => {

    const { to, subject, text } = job.data;

    console.log('Sending email to:', to);

    await sendEmail(to, subject, text);
  },
  {
    connection: redisConfig
  }
);

worker.on('completed', job => {
  console.log(`Email job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Email job ${job?.id} failed`, err);
});

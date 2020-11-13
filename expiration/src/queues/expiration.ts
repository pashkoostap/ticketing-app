import Queue from 'bull';
import { nats, OrderExpiredPublisher } from '../nats';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  const publisher = new OrderExpiredPublisher(nats.client);

  await publisher.publish({ id: job.data.orderId });
});

export { expirationQueue };

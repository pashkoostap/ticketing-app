import mongoose from 'mongoose';

import { app } from './app';
import { nats } from './nats';
import { ping } from './utils';
import { listenToEvents } from './nats/listeners';

const connectDB = async () => {
  console.log('Testing tickets service');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (process.env.APP_HOST) {
    ping(process.env.APP_HOST, 60 * 60 * 1000);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log(`Connected to: ${process.env.MONGO_URI}`);

    await nats.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    nats.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => nats.client.close());
    process.on('SIGTERM', () => nats.client.close());

    listenToEvents(nats.client);

    app.listen(4000, () => {
      console.log('tickets/0.0.1:4000');
    });
  } catch (err) {
    console.error(err);
  }
};

connectDB();

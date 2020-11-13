import mongoose from 'mongoose';
import { nats } from './nats';

import { app } from './app';
import { listenToEvents } from './nats';

const connectDB = async () => {
  if (!process.env.PORT) {
    throw new Error('PORT must be defined');
  }

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

    app.listen(process.env.PORT, () => {
      console.log(`orders/0.0.1:${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

connectDB();

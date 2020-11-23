import mongoose from 'mongoose';

import { app } from './app';

const connectDB = async () => {
  console.log('Checking test-auth workflow once again');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log(`Connected to: ${process.env.MONGO_URI}`);

    app.listen(4000, () => {
      console.log('auth/0.0.4:4000');
    });
  } catch (err) {
    console.error(err);
  }
};

connectDB();

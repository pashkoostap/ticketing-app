import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoDB: MongoMemoryServer;

beforeAll(async () => {
  mongoDB = new MongoMemoryServer();
  process.env.JWT_KEY = 'jwt-test';

  const mongoURI = await mongoDB.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close();
});

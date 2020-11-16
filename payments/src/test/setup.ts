import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: ObjectID | string): string[];
    }
  }
}

jest.mock('../nats/client');

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
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close();
});

global.signin = (id: ObjectID = new ObjectID()) => {
  const payload = { id, email: 'test@test.com' };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(session).toString('base64');

  return [`express:sess=${base64}`];
};

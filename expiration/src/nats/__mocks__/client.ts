import nodeMats, { Stan } from 'node-nats-streaming';

class NatsClientMock {
  private _client?: any;

  constructor() {
    this._client = {
      publish: jest
        .fn()
        .mockImplementation(
          (subject: string, data: string, callback: () => void) => {
            callback();
          }
        ),
    };
  }

  get client() {
    return this._client;
  }

  set client(client: Stan | any) {
    this._client = client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    return Promise.resolve();
  }
}

export const nats = new NatsClientMock();

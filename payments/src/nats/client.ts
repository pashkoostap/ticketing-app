import nodeNats, { Stan } from 'node-nats-streaming';

class NatsClient {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access nats client before connecting');
    }

    return this._client;
  }

  set client(client: Stan) {
    this._client = client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this.client = nodeNats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log(`NATS connected: URL: ${url} ${clusterId}/${clientId}`);

        resolve();
      });
      this.client.on('error', (err) => reject(err));
    });
  }
}

export const nats = new NatsClient();

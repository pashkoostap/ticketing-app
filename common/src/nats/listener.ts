import { Stan, Message } from 'node-nats-streaming';

import { Event } from './events';

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract groupName: string;
  protected client: Stan;
  protected ackWait = 5 * 1000;
  abstract onMessage(data: T['data'], msg: Message): void;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.groupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.groupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message recieved: ${msg.getSubject()} / ${this.groupName}`);

      this.onMessage(this.parseMessage(msg), msg);
    });
  }

  parseMessage(msg: Message): any {
    let data = msg.getData();

    if (data instanceof Buffer) {
      data = data.toString('utf-8');
    }

    return JSON.parse(data as string);
  }
}

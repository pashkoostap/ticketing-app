import { Ticket } from '../ticket';

describe('models/ticket', () => {
  it('should implement optimistic concurrency control', async (done) => {
    const ticket = Ticket.build({
      title: 'Ticket title',
      price: 10,
      userId: 'userId',
    });
    await ticket.save();

    const firstTicket = await Ticket.findById(ticket.id);
    const secondTicket = await Ticket.findById(ticket.id);

    firstTicket?.set({ price: 10 });
    secondTicket?.set({ price: 15 });

    await firstTicket?.save();
    try {
      await secondTicket?.save();
    } catch (err) {
      return done(); // Test should stop execution here
    }
  });

  it('it should increment the ticket version on multiple saves', async () => {
    const ticket = Ticket.build({
      title: 'Ticket title',
      price: 10,
      userId: 'userId',
    });
    await ticket.save();

    expect(ticket.version).toEqual(0);

    ticket.set({ price: 15 });
    await ticket.save();

    expect(ticket.version).toEqual(1);

    ticket.set({ price: 20 });
    await ticket.save();

    expect(ticket.version).toEqual(2);
  });
});

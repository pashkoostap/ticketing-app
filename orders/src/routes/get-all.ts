import { Router } from 'express';

const router = Router();

router.get('/api/orders', async (req, res) => {
  res.status(200).send('found');
});

export { router as getAllOrdersRouter };

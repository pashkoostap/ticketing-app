import { Router } from 'express';

const router = Router();

router.delete('/api/orders/:id', async (req, res) => {
  res.status(200).send('deleted');
});

export { router as deleteOrderRouter };

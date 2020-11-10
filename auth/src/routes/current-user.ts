import { Router } from 'express';

import { currentUser } from '@pashkoostap-learning/ticketing-common';

const router = Router();

router.get('/api/users/current', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

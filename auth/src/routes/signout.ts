import { Router } from 'express';

const router = Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({ message: 'Signout successfully' });
});

export { router as signoutRouter };

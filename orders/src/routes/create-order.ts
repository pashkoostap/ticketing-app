import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
} from '@pashkoostap_learning_ticketing/common';

const router = Router();

router.post(
  '/api/orders',
  requireAuth,
  [body('tickedId').not().isEmpty().withMessage('Ticket id is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(200).send('created');
  }
);

export { router as createOrderRouter };

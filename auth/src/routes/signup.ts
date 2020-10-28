import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import {
  BadRequestError,
  validateRequest,
} from '@pashkoostap_learning_ticketing/common';
import { User } from '../models';

const router = Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Please provide valid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      body: { email, password },
    } = req;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    const user = User.build({ email, password });
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: token };

    res.status(201).send(user);
  }
);

export { router as signupRouter };

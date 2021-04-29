import express from 'express';
export const usersBillsRouter = express.Router();
import { UsersBills } from '../models/users_bills.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const passport = require('passport');

usersBillsRouter.get(
  '/usersBills',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    UsersBills.findAll()
      .then((usersBills) => {
        res.status(200).send({
          success: 'true',
          message: 'usersBills',
          usersBills: usersBills,
        });
      })
      .catch((err) => console.log('Error when fetching all usersBills: ', err));
  },
);

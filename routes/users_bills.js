import express from 'express';
export const usersBillsRouter = express.Router();
import { UsersBills } from '../models/users_bills.js';

usersBillsRouter.get('/usersBills', (req, res) => {
  UsersBills.findAll()
    .then((usersBills) => {
      res.status(200).send({
        success: 'true',
        message: 'usersBills',
        usersBills: usersBills,
      });
    })
    .catch((err) => console.log('Error when fetching all usersBills: ', err));
});

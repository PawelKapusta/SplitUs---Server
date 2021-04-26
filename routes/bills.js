import express from 'express';
export const billsRouter = express.Router();
import { Bills } from '../models/bills.js';

billsRouter.get('/bills', (req, res) => {
  Bills.findAll()
    .then((bills) => {
      res.status(200).send({
        success: 'true',
        message: 'bills',
        bills: bills,
      });
    })
    .catch((err) => console.log('Error when fetching all bills: ', err));
});

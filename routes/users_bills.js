import express from 'express';
import { UsersBills } from '../models/users_bills.js';
import { createRequire } from 'module';

export const usersBillsRouter = express.Router();
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

usersBillsRouter.post(
  '/usersBills',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { billId, usersBillsArray, CurrencyCode, isRegulated } = req.body;
    res.setHeader('Content-Type', 'application/json');
    res.header('Content-Type', 'application/json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(usersBillsArray);
    try {
      for (let i = 0; i < usersBillsArray.length; i++) {
        console.log('element in the array', usersBillsArray[i]);
        const billUsers = await UsersBills.create({
          UserId: usersBillsArray[i].userId,
          BillId: billId,
          CurrencyCode: CurrencyCode,
          Debt: usersBillsArray[i].debt,
          isRegulated: isRegulated,
        })
          .then(function (billUsers) {
            res.write(JSON.stringify(billUsers));
            res.status(200).send({
              success: 'true',
              message: 'billUsers',
              billUsers: billUsers,
            });
            next();
          })
          .catch((error) => console.log('Error', error));
      }

      return res.end('ok');
    } catch (error) {
      console.log('Error with creating billUsers: ', error);
      res.status(500).json(error);
      return res.end('error');
    }
  },
);

usersBillsRouter.delete(
  '/usersBills/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const usersBillsId = req.params.id;
    UsersBills.findByPk(usersBillsId)
      .then((billUsers) => {
        billUsers
          .destroy()
          .then(
            res.status(200).send({
              success: 'true',
              message: 'billUsers',
              billUsers: 'Successfully deleted',
            }),
          )
          .catch((error) =>
            console.log(
              'Error with destroying instance of usersBills in database: ',
              error.message,
            ),
          );
      })
      .catch((err) => console.log(`Error when fetching usersBills with ID: ${usersBillsId} `, err));
  },
);

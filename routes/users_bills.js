import express from 'express';
import { UsersBills } from '../models/users_bills.js';
import { createRequire } from 'module';
import { v4 as uuidv4 } from 'uuid';
export const usersBillsRouter = express.Router();
const require = createRequire(import.meta.url);
const passport = require('passport');

usersBillsRouter.get(
  '/usersBills',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(uuidv4());
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

usersBillsRouter.put(
  '/usersBills/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { Debt, isRegulated } = req.body;

    const usersBillsId = req.params.id;

    try {
      const usersBills = await UsersBills.findOne({ where: { ID: usersBillsId } });
      usersBills.Debt = Debt;
      usersBills.isRegulated = isRegulated;
      await usersBills.save();

      return res.status(200).send({
        success: 'Successfully updated bill',
        message: 'usersBills',
        usersBills: usersBills,
      });
    } catch (error) {
      console.log('Error when updating bill: ', error);
    }
  },
);

usersBillsRouter.post(
  '/usersBills',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { billId, usersBillsArray, isRegulated } = req.body;

    const usersBillsPromisesArray = [];

    for (let i = 0; i < usersBillsArray.length; i++) {
      const findUserInBillsPromise = UsersBills.findOne({
        where: {
          UserId: usersBillsArray[i].userId,
          BillId: billId,
          Debt: usersBillsArray[i].debt,
          isRegulated: isRegulated,
        },
      });

      const checkIfAlreadyExistsInDatabase = await Promise.all([findUserInBillsPromise]);

      if (checkIfAlreadyExistsInDatabase[0] === null) {
        const billUser = await UsersBills.create({
          ID: uuidv4(),
          UserId: usersBillsArray[i].userId,
          BillId: billId,
          Debt: usersBillsArray[i].debt,
          isRegulated: isRegulated,
        });
        usersBillsPromisesArray.push(billUser);
      }
    }
    try {
      await Promise.all(
        usersBillsPromisesArray.map(function (inner) {
          return Promise.all([inner]);
        }),
      );
      res.status(200).send({
        success: 'Successfully added all usersBills',
      });
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

import express from 'express';
import { UsersBills } from '../models/users_bills.js';
import { Users } from '../models/users.js';
import { createRequire } from 'module';
import { v4 as uuidv4 } from 'uuid';
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

usersBillsRouter.get(
  '/usersBills/bill/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const billId = req.params.id;

    const usersBills = UsersBills.findAll({ where: { BillId: billId } });

    try {
      const data = await Promise.all([usersBills]);
      const allUsersIDArray = [];
      data[0].map((user) => allUsersIDArray.push(user?.UserId));
      if (res.status(200)) {
        const usersDataPromise = Users.findAll({ where: { ID: allUsersIDArray } });
        const usersData = await Promise.all([usersDataPromise]);
        const allUsersDataArray = [];
        usersData[0].map((user) => allUsersDataArray.push(user));
        res.status(200).send({
          usersBills: data[0],
          usersData: allUsersDataArray,
        });
      }
    } catch (error) {
      console.log('Error with getting users that are members in bill with given id: ', error);
      return res.status(500).json(error);
    }
  },
);

usersBillsRouter.put(
  '/usersBills/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const usersBillsId = req.params.id;

    try {
      const usersBills = await UsersBills.findOne({ where: { ID: usersBillsId } });
      usersBills.isRegulated = true;
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

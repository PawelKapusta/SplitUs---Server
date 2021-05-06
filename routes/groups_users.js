import express from 'express';
export const groupsUsersRouter = express.Router();
import { GroupsUsers } from '../models/groups_users.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const passport = require('passport');

groupsUsersRouter.get(
  '/groupsUsers',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    GroupsUsers.findAll()
      .then((groupsUsers) => {
        res.status(200).send({
          success: 'true',
          message: 'groupsUsers',
          groupsUsers: groupsUsers,
        });
      })
      .catch((err) => console.log('Error when fetching all groupsUsers: ', err));
  },
);

groupsUsersRouter.post(
  '/groupsUsers',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { GroupId, usersIdArray } = req.body;

    const groupsUsersPromisesArray = [];

    for (let i = 0; i < usersIdArray.length; i++) {
      console.log('element in the array', usersIdArray[i]);
      const findUserInGroupPromise = GroupsUsers.findOne({
        where: { GroupId: GroupId, UserId: usersIdArray[i] },
      });

      const checkIfAlreadyExistsInDatabase = await Promise.all([findUserInGroupPromise]);

      if (checkIfAlreadyExistsInDatabase[0] === null) {
        const groupsUsers = await GroupsUsers.create({
          GroupId: GroupId,
          UserId: usersIdArray[i],
        });
        groupsUsersPromisesArray.push(groupsUsers);
      }
    }

    try {
      await Promise.all(
        groupsUsersPromisesArray.map(function (inner) {
          return Promise.all([inner]);
        }),
      );
      res.status(200).send({
        success: 'Successfully added all groupsUsers',
      });
    } catch (error) {
      console.log('Error with creating groupsUsers: ', error);
      res.status(500).json(error);
    }
  },
);

groupsUsersRouter.delete(
  '/groupsUsers/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const groupsUsersId = req.params.id;
    GroupsUsers.findByPk(groupsUsersId)
      .then((groupUsers) => {
        groupUsers
          .destroy()
          .then(
            res.status(200).send({
              success: 'true',
              message: 'groupUsers',
              groupUsers: 'Successfully deleted',
            }),
          )
          .catch((error) =>
            console.log(
              'Error with destroying instance of groupUsers in database: ',
              error.message,
            ),
          );
      })
      .catch((err) =>
        console.log(`Error when fetching groupUsers with ID: ${groupsUsersId} `, err),
      );
  },
);

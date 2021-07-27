import express from 'express';
export const groupsUsersRouter = express.Router();
import { GroupsUsers } from '../models/groups_users.js';
import { createRequire } from 'module';
import { v4 as uuidv4 } from 'uuid';
import { Groups } from '../models/groups.js';
import { Users } from '../models/users.js';
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

groupsUsersRouter.get(
  '/groupsUsers/user/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const userId = req.params.id;

    const allGroupsIdPromise = await GroupsUsers.findAll({ where: { UserId: userId } })
      .then((response) => response)
      .catch((err) => console.log('Error when fetching all groupsID of given userId: ', err));

    const allGroupsID = allGroupsIdPromise.map((group) => group['GroupId']);

    Groups.findAll({ where: { ID: allGroupsID } })
      .then((response) => {
        res.status(200).send({
          response,
        });
      })
      .catch((err) => console.log('Error when fetching all groups of given userId: ', err));

    console.log(allGroupsID);
  },
);

groupsUsersRouter.get(
  '/groupsUsers/group/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const groupId = req.params.id;

    const allUsersIdPromise = await GroupsUsers.findAll({ where: { GroupId: groupId } })
      .then((response) => response)
      .catch((err) => console.log('Error when fetching all usersId of given groupId: ', err));

    const allUsersID = allUsersIdPromise.map((user) => user['UserId']);

    Users.findAll({ where: { ID: allUsersID } })
      .then((response) => {
        res.status(200).send({
          response,
        });
      })
      .catch((err) => console.log('Error when fetching all users of given groupId: ', err));

    console.log(allUsersID);
  },
);

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

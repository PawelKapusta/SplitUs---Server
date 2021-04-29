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
    const { groupId, usersIdArray } = req.body;
    res.setHeader('Content-Type', 'application/json');
    res.header('Content-Type', 'application/json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
      for (let i = 0; i < usersIdArray.length; i++) {
        console.log('element in the array', usersIdArray[i]);
        const groupsUsers = await GroupsUsers.create({
          GroupId: groupId,
          UserId: parseInt(usersIdArray[i]),
        })
          .then(function (groupsUsers) {
            res.write(JSON.stringify(groupsUsers)); //?
            res.status(200).send({
              success: 'true',
              message: 'groupsUsers',
              groupsUsers: groupsUsers,
            });
            next();
          })
          .catch((error) => console.log('Error', error));
      }

      return res.end('ok');
    } catch (error) {
      console.log('Error with creating groupsUsers: ', error);
      res.status(500).json(error);
      return res.end('error');
    }
  },
);

groupsUsersRouter.delete(
  '/groupsUsers/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
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
            console.log('Error with destroying instance of group in database: ', error.message),
          );
      })
      .catch((err) => console.log(`Error when fetching group with ID: ${groupsUsersId} `, err));
  },
);

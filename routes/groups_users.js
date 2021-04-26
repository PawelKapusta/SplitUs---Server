import express from 'express';
export const groupsUsersRouter = express.Router();
import { GroupsUsers } from '../models/groups_users.js';

groupsUsersRouter.get('/groupsUsers', (req, res) => {
  GroupsUsers.findAll()
    .then((groupsUsers) => {
      res.status(200).send({
        success: 'true',
        message: 'groupsUsers',
        groupsUsers: groupsUsers,
      });
    })
    .catch((err) => console.log('Error when fetching all groupsUsers: ', err));
});

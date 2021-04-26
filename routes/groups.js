import express from 'express';
export const groupsRouter = express.Router();
import { Groups } from '../models/groups.js';

groupsRouter.get('/groups', (req, res) => {
  Groups.findAll()
    .then((groups) => {
      res.status(200).send({
        success: 'true',
        message: 'groups',
        groups: groups,
      });
    })
    .catch((err) => console.log('Error when fetching all groups: ', err));
});

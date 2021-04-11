import express from 'express';
export const usersRouter = express.Router();
import { Users } from '../models/users.js';

usersRouter.get('/users', (req, res) => {
  Users.findAll()
    .then((users) => {
      res.status(200).send({
        success: 'true',
        message: 'users',
        users: users,
      });
    })
    .catch((err) => console.log('Error when fetching all users: ', err));
});

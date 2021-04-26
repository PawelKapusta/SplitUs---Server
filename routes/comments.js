import express from 'express';
export const commentsRouter = express.Router();
import { Comments } from '../models/comments.js';

commentsRouter.get('/comments', (req, res) => {
  Comments.findAll()
    .then((comments) => {
      res.status(200).send({
        success: 'true',
        message: 'comments',
        comments: comments,
      });
    })
    .catch((err) => console.log('Error when fetching all comments: ', err));
});

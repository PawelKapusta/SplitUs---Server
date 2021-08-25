import express from 'express';
export const commentsRouter = express.Router();
import { Comments } from '../models/comments.js';
import { createRequire } from 'module';
import { v4 as uuidv4 } from 'uuid';
const require = createRequire(import.meta.url);
const passport = require('passport');

commentsRouter.get('/comments', passport.authenticate('jwt', { session: false }), (req, res) => {
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

commentsRouter.get(
  '/comments/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const BillId = req.params.id;
    Comments.findAll({ where: { BillId: BillId } })
      .then((comments) => {
        res.status(200).send({
          success: 'true',
          message: 'comment',
          comments: comments,
        });
      })
      .catch((err) => console.log(`Error when fetching comment of bill with id: ${BillId} `, err));
  },
);

commentsRouter.post(
  '/comments',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { BillId, UserId, Content } = req.body;

    const comment = await Comments.create({
      ID: uuidv4(),
      BillId: BillId,
      UserId: UserId,
      Content: Content,
    });
    try {
      await Promise.all([comment]);
      res.status(200).send({
        success: 'Successfully added comment',
      });
    } catch (error) {
      console.log('Error with creating comment: ', error);
      return res.status(500).json(error);
    }
  },
);

commentsRouter.put(
  '/comments/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { BillId, UserId, Content } = req.body;
    const commentId = req.params.id;

    try {
      const comment = await Comments.findOne({ where: { ID: commentId } });
      comment.BillId = BillId;
      comment.UserId = UserId;
      comment.Content = Content;
      await comment.save();
      return res.status(200).send({
        success: 'true',
        message: 'comment',
        comment: comment,
      });
    } catch (error) {
      console.log('Error when updating comment: ', error);
    }
  },
);

commentsRouter.delete(
  '/comments/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const commentId = req.params.id;
    Comments.findByPk(commentId)
      .then((comment) => {
        comment
          .destroy()
          .then(
            res.status(200).send({
              success: 'true',
              message: 'comment',
              comment: 'Successfully deleted',
            }),
          )
          .catch((error) =>
            console.log('Error with destroying instance of comment in database: ', error.message),
          );
      })
      .catch((err) => console.log(`Error when fetching comment with ID: ${commentId} `, err));
  },
);

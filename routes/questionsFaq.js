import express from 'express';
export const questionsFaqRouter = express.Router();
import { QuestionsFaq } from '../models/questionsFaq.js';
import { createRequire } from 'module';
import { isAdmin } from '../utils.js';
import { v4 as uuidv4 } from 'uuid';
const require = createRequire(import.meta.url);
const passport = require('passport');

questionsFaqRouter.get('/questionsFaq', (req, res) => {
  QuestionsFaq.findAll()
    .then((QuestionsFaq) => {
      res.status(200).send({
        success: 'true',
        message: 'QuestionsFaq',
        QuestionsFaq: QuestionsFaq,
      });
    })
    .catch((err) => console.log('Error when fetching all Questions FAQ: ', err));
});

questionsFaqRouter.post(
  '/questionsFaq',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  async (req, res) => {
    const { Question, Answer } = req.body;
    try {
      const question = await QuestionsFaq.create({
        ID: uuidv4(),
        Question: Question,
        Answer: Answer,
      }).then(function (question) {
        res.json(question);
      });
      res.status(200).send({
        success: 'true',
      });
      return res.json(question);
    } catch (error) {
      console.log('Error with creating question FAQ: ', error);
      return res.status(500).json(error);
    }
  },
);

questionsFaqRouter.put(
  '/questionsFaq/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  async (req, res) => {
    const { Question, Answer } = req.body;
    const questionId = req.params.id;

    try {
      const question = await QuestionsFaq.findOne({ where: { ID: questionId } });
      question.Question = Question;
      question.Answer = Answer;
      await question.save();
      return res.status(200).send({
        success: 'true',
        message: 'questionsFaq',
        question: question,
      });
    } catch (error) {
      console.log('Error when updating question FAQ: ', error);
    }
  },
);

questionsFaqRouter.delete(
  '/questionsFaq/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  (req, res) => {
    const questionId = req.params.id;
    QuestionsFaq.findByPk(questionId)
      .then((question) => {
        question
          .destroy()
          .then(
            res.status(200).send({
              success: 'true',
              message: 'questionsFaq',
              question: 'Successfully deleted',
            }),
          )
          .catch((error) =>
            console.log(
              'Error with destroying instance of Question FAQ in database: ',
              error.message,
            ),
          );
      })
      .catch((err) => console.log(`Error when deleting question FAQ with ID: ${questionId} `, err));
  },
);

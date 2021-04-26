import express from 'express';
export const questionsFaqRouter = express.Router();
import { QuestionsFaq } from '../models/questionsFaq.js';

questionsFaqRouter.get('/questionsFaq', (req, res) => {
  QuestionsFaq.findAll()
    .then((QuestionsFaq) => {
      res.status(200).send({
        success: 'true',
        message: 'QuestionsFaq',
        QuestionsFaq: QuestionsFaq,
      });
    })
    .catch((err) => console.log('Error when fetching all QuestionsFaq: ', err));
});

questionsFaqRouter.post('/questionsFaq', async (req, res) => {
  const { Question, Answer } = req.body;
  try {
    const question = await QuestionsFaq.create({ Question: Question, Answer: Answer }).then(
      function (question) {
        res.json(question);
      },
    );
    res.status(200).send({
      success: 'true',
    });
    return res.json(question);
  } catch (error) {
    console.log('Error with creating question faq: ', error);
    return res.status(500).json(error);
  }
});

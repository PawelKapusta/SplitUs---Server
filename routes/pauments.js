import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from 'express';
export const paymentsRouter = express.Router();
const passport = require('passport');

paymentsRouter.get('/payments', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('You have a total of: 2400$');
});

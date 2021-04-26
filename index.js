import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createRequire } from 'module';
import { db } from './dbconfig.js';
import { usersRouter } from './routes/users.js';
import { groupsRouter } from './routes/groups.js';
import { billsRouter } from './routes/bills.js';
import { usersBillsRouter } from './routes/users_bills.js';
import { commentsRouter } from './routes/comments.js';
import { groupsUsersRouter } from './routes/groups_users.js';
import { questionsFaqRouter } from './routes/questionsFaq.js';
import { paymentsRouter } from './routes/pauments.js';
import { Users } from './models/users.js';
import { notFound, errorHandler } from './middlewares.js';

const require = createRequire(import.meta.url);
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { Sequelize } = require('sequelize');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      return Users.findOne({ where: { id: jwtPayload.id } })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    },
  ),
);

require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());

db.authenticate()
  .then(() => console.log('Database Connected ...'))
  .catch((err) => console.log('Error: ' + err));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('<h1>Server side :)</h1>');
});

app.get('/register', usersRouter);
app.post('/register', usersRouter);
app.post('/login', usersRouter);
app.get('/groups', groupsRouter);
app.get('/bills', billsRouter);
app.get('/usersBills', usersBillsRouter);
app.get('/comments', commentsRouter);
app.get('/groupsUsers', groupsUsersRouter);
app.get('/questionsFaq', questionsFaqRouter);
app.post('/questionsFaq', questionsFaqRouter);
app.get('/payments', paymentsRouter);

app.listen(process.env.PORT || 5000, async () => {
  console.log(`Running on port ${process.env.PORT} or 5000`);
});

app.use(notFound);
app.use(errorHandler);

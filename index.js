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

const require = createRequire(import.meta.url);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

db.authenticate()
  .then(() => console.log('Database Connected ...'))
  .catch((err) => console.log('Error: ' + err));

app.get('/', (req, res) => {
  res.send('<h1>Server side :)</h1>');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/users', usersRouter);
app.get('/groups', groupsRouter);
app.get('/bills', billsRouter);
app.get('/usersBills', usersBillsRouter);
app.get('/comments', commentsRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Running on port ${process.env.PORT} or 5000`);
});

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

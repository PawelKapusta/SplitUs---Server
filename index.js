import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const mysql = require('mysql');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER ,
  password: process.env.DB_PASS,
  database: process.env.DB,
});

db.connect((error) => {
  if (error) {
    console.log('Database connection error');
  } else {
    console.log('Database connected');
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Server side</h1>');
});


app.listen(process.env.PORT || 5000, () => {
  console.log('Running on port 5000');
});

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

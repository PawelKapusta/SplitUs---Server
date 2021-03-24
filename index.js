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

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
};
let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);

  connection.connect(function (err) {
    if (err) {
      console.log('Database connection error:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Database connected');
    }
  });

  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.get('/', (req, res) => {
  res.send('<h1>Server side</h1>');
});
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users;', (error, rows, fields) => {
    if (error) {
      console.log('Error in getting users query');
    } else {
      res.send(rows);
      console.log('Successful getting users query');
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Running on port 5000');
});

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

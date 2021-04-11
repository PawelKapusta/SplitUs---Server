import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Sequelize } = require('sequelize');

require('dotenv').config();
export const db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

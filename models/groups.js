import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Sequelize } = require('sequelize');
import { db } from '../dbconfig.js';

export const Groups = db.define(
  'groups',
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    DataCreated: {
      type: Sequelize.DATE,
      isDate: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

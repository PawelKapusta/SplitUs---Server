import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Sequelize } = require('sequelize');
import { db } from '../dbconfig.js';

export const Comments = db.define(
  'comments',
  {
    ID: {
      type: Sequelize.STRING,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    BillId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'bills',
        key: 'ID',
      },
    },
    UserId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'ID',
      },
    },
    Content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Sequelize } = require('sequelize');
import { db } from '../dbconfig.js';

export const UsersBills = db.define(
  'usersbills',
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'ID',
      },
    },
    BillId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'bills',
        key: 'ID',
      },
    },
    Debt: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    isRegulated: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  },
);

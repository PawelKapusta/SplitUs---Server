import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Sequelize } = require('sequelize');
import { db } from '../dbconfig.js';

export const Bills = db.define(
  'bills',
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
    DataEnd: {
      type: Sequelize.DATE,
      isDate: true,
      allowNull: false,
    },
    BillImage: {
      type: Sequelize.STRING(1024),
      isUrl: true,
    },
    CurrencyCode: {
      type: Sequelize.STRING(3),
      allowNull: false,
    },
    Debt: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    OwnerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'ID',
      },
    },
    CodeQR: {
      type: Sequelize.STRING(1024),
    },
    GroupId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'ID',
      },
    },
  },
  {
    timestamps: false,
  },
);

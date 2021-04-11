import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Sequelize } = require('sequelize');
import { db } from '../dbconfig.js';

export const Users = db.define(
  'users',
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    FullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      isEmail: true,
    },
    Password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Phone: {
      type: Sequelize.INTEGER,
      allowNull: false,
      isInt: true,
    },
    BirthDate: {
      type: Sequelize.DATE,
      isDate: true,
      allowNull: false,
    },
    AvatarImage: {
      type: Sequelize.STRING(1024),
      isUrl: true,
    },
  },
  {
    timestamps: false,
  },
);

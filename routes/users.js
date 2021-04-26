import express from 'express';
import jwt from 'jsonwebtoken';
import { Users } from '../models/users.js';
import { createRequire } from 'module';
export const usersRouter = express.Router();

const require = createRequire(import.meta.url);
const bcrypt = require('bcrypt');
require('dotenv').config();

usersRouter.get('/register', (req, res) => {
  Users.findAll()
    .then((users) => {
      res.status(200).send({
        success: 'true',
        message: 'users',
        users: users,
      });
    })
    .catch((err) => console.log('Error when fetching all users: ', err));
});

usersRouter.post('/register', async (req, res) => {
  const { FullName, Email, Password, Phone, BirthDate, AvatarImage, isAdmin, isBlocked } = req.body;

  try {
    const alreadyExistsUser = await Users.findOne({ where: { Email } }).catch((err) => {
      console.log('Error: ', err);
    });

    if (alreadyExistsUser) {
      return res.status(409).json({ message: 'User with this email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = new Users({
      FullName,
      Email,
      Password: hashedPassword,
      Phone,
      BirthDate,
      AvatarImage,
      isAdmin,
      isBlocked,
    });
    console.log('After user');
    const savedUser = await user.save().catch((err) => {
      console.log('Error: ', err);
      res.status(500).json({ error: 'Cannot register user at the moment!' });
    });
    if (savedUser) res.json({ message: 'Thanks for registering' });
    res.setHeader('Content-Type', 'application/json'); //?
    res.writeHead(200, { 'Content-Type': 'application/json' }); //?
    res.write(JSON.stringify(user)); //?
    res.end(); //?
    res.status(200).send({
      success: 'true',
    });
    res.redirect('/login');
    return res.json(user);
  } catch (error) {
    res.redirect('/register');
    console.log('Error with creating user: ', error);
    return res.status(500).json(error);
  }
});

usersRouter.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  console.log(Email, Password);
  const userWithEmail = await Users.findOne({ where: { Email } }).catch((err) => {
    console.log('Error: ', err);
  });

  if (!userWithEmail) return res.json({ message: 'Email or password does not match!' });
  //const hashedPassword = await bcrypt.hash(Password, 10);
  if (!(await bcrypt.compare(Password, userWithEmail.Password)))
    return res.json({ message: 'Password does not match!' });

  const jwtToken = jwt.sign(
    { id: userWithEmail.ID, email: userWithEmail.Email },
    process.env.JWT_SECRET,
  );
  res.json({ message: 'Welcome back', token: jwtToken });
});

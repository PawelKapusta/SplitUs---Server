import express from 'express';
import jwt from 'jsonwebtoken';
import { Users } from '../models/users.js';
import { createRequire } from 'module';
import { isAdmin } from '../utils.js';

export const usersRouter = express.Router();
const require = createRequire(import.meta.url);
const bcrypt = require('bcrypt');
const passport = require('passport');
require('dotenv').config();

usersRouter.get('/users', passport.authenticate('jwt', { session: false }), isAdmin, (req, res) => {
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

usersRouter.get(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  (req, res) => {
    const userId = req.params.id;
    Users.findOne({ where: { ID: userId } })
      .then((user) => {
        res.status(200).send({
          success: 'true',
          message: 'user',
          user: user,
        });
      })
      .catch((err) => console.log(`Error when fetching user with ID: ${userId} `, err));
  },
);

usersRouter.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { FullName, Email, Password, Phone, BirthDate, AvatarImage } = req.body;
  const userId = req.user.ID;
  console.log('idididididid', userId);
  const hashedPassword = await bcrypt.hash(Password, 10);

  try {
    const user = await Users.findOne({ where: { ID: userId } });
    user.FullName = FullName;
    user.Email = Email;
    user.Password = hashedPassword;
    user.Phone = Phone;
    user.BirthDate = BirthDate;
    user.AvatarImage = AvatarImage;
    await user.save();
    return res.status(200).send({
      success: 'true',
      message: 'user',
      user: user,
    });
  } catch (error) {
    console.log('Error when updating user: ', error);
  }
});

usersRouter.put(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  async (req, res) => {
    const { isAdmin, isBlocked } = req.body;
    const userId = req.params.id;

    try {
      const user = await Users.findOne({ where: { ID: userId } });
      user.isAdmin = isAdmin;
      user.isBlocked = isBlocked;
      await user.save();
      return res.status(200).send({
        success: 'true',
        message: 'user',
        user: user,
      });
    } catch (error) {
      console.log('Error when updating user: ', error);
    }
  },
);

usersRouter.delete(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  (req, res) => {
    const userId = req.params.id;
    Users.findByPk(userId)
      .then((user) => {
        user
          .destroy()
          .then(
            res.status(200).send({
              success: 'true',
              message: 'user',
              user: 'Successfully deleted',
            }),
          )
          .catch((error) =>
            console.log('Error with destroying instance of User in database: ', error.message),
          );
      })
      .catch((err) => console.log(`Error when fetching user with ID: ${userId} `, err));
  },
);

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

    const savedUser = await user.save().catch((err) => {
      console.log('Error: ', err);
      res.status(500).json({ error: 'Cannot register user at the moment!' });
    });
    if (savedUser) res.json({ message: 'Thanks for registering' });
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(user));
    res.status(200).send({
      success: 'true',
    });
    res.redirect('/login');
    res.end();
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
  if (!(await bcrypt.compare(Password, userWithEmail.Password)))
    return res.json({ message: 'Password does not match!' });

  const jwtToken = jwt.sign(
    { id: userWithEmail.ID, email: userWithEmail.Email },
    process.env.JWT_SECRET,
  );
  res.json({
    message: 'Welcome back',
    token: jwtToken,
  });
  res.send({
    FullName: userWithEmail.FullName,
    Email: userWithEmail.Email,
    Password: userWithEmail.Password,
    Phone: userWithEmail.Phone,
    BirthDate: userWithEmail.BirthDate,
    AvatarImage: userWithEmail.AvatarImage,
    isAdmin: userWithEmail.isAdmin,
    isBlocked: userWithEmail.isBlocked,
    token: jwtToken,
  });
});

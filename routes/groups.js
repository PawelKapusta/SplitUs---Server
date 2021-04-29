import express from 'express';
export const groupsRouter = express.Router();
import { Groups } from '../models/groups.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const passport = require('passport');

groupsRouter.get('/groups', passport.authenticate('jwt', { session: false }), (req, res) => {
  Groups.findAll()
    .then((groups) => {
      res.status(200).send({
        success: 'true',
        message: 'groups',
        groups: groups,
      });
    })
    .catch((err) => console.log('Error when fetching all groups: ', err));
});

groupsRouter.get('/groups/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const groupId = req.params.id;
  Groups.findOne({ where: { ID: groupId } })
    .then((group) => {
      res.status(200).send({
        success: 'true',
        message: 'group',
        group: group,
      });
    })
    .catch((err) => console.log(`Error when fetching group with ID: ${groupId} `, err));
});

groupsRouter.post('/groups', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { Name, Description, DataCreated } = req.body;
  try {
    const group = await Groups.create({
      Name: Name,
      Description: Description,
      DataCreated: DataCreated,
    }).then(function (group) {
      res.json(group);
    });
    res.status(200).send({
      success: 'true',
    });
    return res.json(group);
  } catch (error) {
    console.log('Error with creating group: ', error);
    return res.status(500).json(error);
  }
});

groupsRouter.put(
  '/groups/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { Name, Description, DataCreated } = req.body;
    const groupId = req.params.id;

    try {
      const group = await Groups.findOne({ where: { ID: groupId } });
      group.Name = Name;
      group.Description = Description;
      group.DataCreated = DataCreated;
      await group.save();
      return res.status(200).send({
        success: 'true',
        message: 'group',
        group: group,
      });
    } catch (error) {
      console.log('Error when updating group: ', error);
    }
  },
);

groupsRouter.delete('/groups/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const groupId = req.params.id;
  Groups.findByPk(groupId)
    .then((group) => {
      group
        .destroy()
        .then(
          res.status(200).send({
            success: 'true',
            message: 'group',
            group: 'Successfully deleted',
          }),
        )
        .catch((error) =>
          console.log('Error with destroying instance of group in database: ', error.message),
        );
    })
    .catch((err) => console.log(`Error when fetching group with ID: ${groupId} `, err));
});

import express from 'express';
export const groupsRouter = express.Router();
import { Groups } from '../models/groups.js';
import { createRequire } from 'module';
import { Comments } from '../models/comments.js';
import { Bills } from '../models/bills.js';
import Sequelize from 'sequelize';
import { UsersBills } from '../models/users_bills.js';
import { GroupsUsers } from '../models/groups_users.js';
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

groupsRouter.delete(
  '/groups/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const groupId = req.params.id;

    const allBills = await Bills.findAll({ where: { GroupId: groupId } })
      .then((response) => response)
      .catch((error) =>
        console.log(`Error when finding bills when deleting group with Id: ${groupId}: `, error),
      );

    const billsIdToDelete = allBills.map((bill) => bill['ID']);
    console.log('Bills id', billsIdToDelete);
    console.log(billsIdToDelete.length);

    const allComments = await Comments.findAll({
      where: Sequelize.or({ BillId: billsIdToDelete }),
    })
      .then((response) => response)
      .catch((error) =>
        console.log(`Error when finding bills when deleting group with Id: ${groupId}: `, error),
      );

    const commentsIdToDelete = allComments.map((comment) => comment['ID']);
    console.log('Comments id', commentsIdToDelete);
    console.log(commentsIdToDelete.length);

    const allUsersBills = await UsersBills.findAll({
      where: Sequelize.or({ BillId: billsIdToDelete }),
    })
      .then((response) => response)
      .catch((error) =>
        console.log(`Error when finding bills when deleting group with Id: ${groupId}: `, error),
      );

    const usersBillsIdToDelete = allUsersBills.map((usersBills) => usersBills['ID']);
    console.log('usersBills id', usersBillsIdToDelete);
    console.log(usersBillsIdToDelete.length);

    const allGroupsUsers = await GroupsUsers.findAll({
      where: { GroupId: groupId },
    })
      .then((response) => response)
      .catch((error) =>
        console.log(`Error when finding bills when deleting group with Id: ${groupId}: `, error),
      );

    const groupsUsersIdToDelete = allGroupsUsers.map((usersBills) => usersBills['ID']);
    console.log('groupsUsers id', groupsUsersIdToDelete);
    console.log(groupsUsersIdToDelete.length);

    Comments.destroy({ where: { ID: commentsIdToDelete } })
      .then(
        res.status(200).send({
          success: 'true',
          message: 'comment',
          comment: 'Successfully deleted',
        }),
      )
      .catch((error) =>
        console.log(
          'Error with destroying instance of comment when deleting group in database: ',
          error.message,
        ),
      );

    UsersBills.destroy({ where: { ID: usersBillsIdToDelete } })
      .then(
        res.status(200).send({
          success: 'true',
          message: 'userBills',
          userBills: 'Successfully deleted',
        }),
      )
      .catch((error) =>
        console.log(
          'Error with destroying instance of userBills when deleting group in database: ',
          error.message,
        ),
      );
    console.log('here');
    Bills.destroy({ where: { ID: billsIdToDelete } })
      .then(
        res.status(200).send({
          success: 'true',
          message: 'bills',
          bills: 'Successfully deleted',
        }),
      )
      .catch((error) =>
        console.log(
          'Error with destroying instance of bills when deleting group in database: ',
          error.message,
        ),
      );

    GroupsUsers.destroy({ where: { ID: groupsUsersIdToDelete } })
      .then(
        res.status(200).send({
          success: 'true',
          message: 'groupsUsers',
          groupsUsers: 'Successfully deleted',
        }),
      )
      .catch((error) =>
        console.log(
          'Error with destroying instance of groupsUsers when deleting group in database: ',
          error.message,
        ),
      );

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
    res.end('ok');
  },
);

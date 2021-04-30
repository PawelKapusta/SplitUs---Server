import express from 'express';
export const billsRouter = express.Router();
import { Bills } from '../models/bills.js';
import { createRequire } from 'module';
import { Comments } from '../models/comments.js';
import { UsersBills } from '../models/users_bills.js';
const require = createRequire(import.meta.url);
const passport = require('passport');

billsRouter.get('/bills', passport.authenticate('jwt', { session: false }), (req, res) => {
  Bills.findAll()
    .then((bills) => {
      res.status(200).send({
        success: 'true',
        message: 'bills',
        bills: bills,
      });
    })
    .catch((err) => console.log('Error when fetching all bills: ', err));
});

billsRouter.get('/bills/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const billId = req.params.id;
  Bills.findOne({ where: { ID: billId } })
    .then((bill) => {
      res.status(200).send({
        success: 'true',
        message: 'bill',
        bill: bill,
      });
    })
    .catch((err) => console.log(`Error when fetching bill with ID: ${billId} `, err));
});

billsRouter.post('/bills', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const {
    Name,
    Description,
    DataCreated,
    DataEnd,
    BillImage,
    CurrencyCode,
    Debt,
    OwnerId,
    CodeQR,
    GroupId,
  } = req.body;
  try {
    const bill = await Bills.create({
      Name: Name,
      Description: Description,
      DataCreated: DataCreated,
      DataEnd: DataEnd,
      BillImage: BillImage,
      CurrencyCode: CurrencyCode,
      Debt: Debt,
      OwnerId: OwnerId,
      CodeQR: CodeQR,
      GroupId: GroupId,
    }).then(function (bill) {
      res.json(bill);
    });
    res.status(200).send({
      success: 'true',
    });
    return res.json(bill);
  } catch (error) {
    console.log('Error with creating bill: ', error);
    return res.status(500).json(error);
  }
});

billsRouter.put(
  '/bills/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const {
      Name,
      Description,
      DataCreated,
      DataEnd,
      BillImage,
      CurrencyCode,
      Debt,
      OwnerId,
      CodeQR,
      GroupId,
    } = req.body;
    const billId = req.params.id;

    try {
      const bill = await Bills.findOne({ where: { ID: billId } });
      bill.Name = Name;
      bill.Description = Description;
      bill.DataCreated = DataCreated;
      bill.DataEnd = DataEnd;
      bill.BillImage = BillImage;
      bill.CurrencyCode = CurrencyCode;
      bill.Debt = Debt;
      bill.OwnerId = OwnerId;
      bill.CodeQR = CodeQR;
      bill.GroupId = GroupId;
      await bill.save();
      return res.status(200).send({
        success: 'true',
        message: 'bill',
        bill: bill,
      });
    } catch (error) {
      console.log('Error when updating bill: ', error);
    }
  },
);

billsRouter.delete(
  '/bills/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const billId = req.params.id;

    const allComments = await Comments.findAll({ where: { BillId: billId } })
      .then((response) => response)
      .catch((error) =>
        console.log(`Error when finding comments when deleting bill with Id: ${billId}: `, error),
      );

    const commentsIdToDelete = allComments.map((comment) => comment['ID']);
    console.log(commentsIdToDelete);
    console.log(allComments.length);

    for (let i = 0; i < commentsIdToDelete.length; i++) {
      const commentIdToDelete = commentsIdToDelete[i];
      Comments.findByPk(commentIdToDelete)
        .then((comment) => {
          comment
            .destroy()
            .then(
              res.status(200).send({
                success: 'true',
                message: 'comment',
                comment: 'Successfully deleted',
              }),
            )
            .catch((error) =>
              console.log(
                'Error with destroying instance of comment when deleting bill in database: ',
                error.message,
              ),
            );
        })
        .catch((err) =>
          console.log(`Error when fetching bill with ID: ${commentIdToDelete} `, err),
        );
    }

    const allUsersBills = await UsersBills.findAll({ where: { BillId: billId } })
      .then((response) => response)
      .catch((error) =>
        console.log(`Error when finding usersBills when deleting bill with Id: ${billId}: `, error),
      );

    const usersBillsIdToDelete = allUsersBills.map((usersBills) => usersBills['ID']);
    console.log(usersBillsIdToDelete);
    console.log(allUsersBills.length);

    for (let i = 0; i < usersBillsIdToDelete.length; i++) {
      const usersBillsIdToDeleteElement = usersBillsIdToDelete[i];
      UsersBills.findByPk(usersBillsIdToDeleteElement)
        .then((usersBills) => {
          usersBills
            .destroy()
            .then(
              res.status(200).send({
                success: 'true',
                message: 'usersBills',
                usersBills: 'Successfully deleted',
              }),
            )
            .catch((error) =>
              console.log(
                'Error with destroying instance of usersBills when deleting bill in database: ',
                error.message,
              ),
            );
        })
        .catch((err) =>
          console.log(
            `Error when deleting usersBills with ID: ${usersBillsIdToDeleteElement} `,
            err,
          ),
        );
    }

    Bills.findByPk(billId)
      .then((bill) => {
        bill
          .destroy()
          .then(
            res.status(200).send({
              success: 'true',
              message: 'bill',
              bill: 'Successfully deleted',
            }),
          )
          .catch((error) =>
            console.log('Error with destroying instance of bill in database: ', error.message),
          );
      })
      .catch((err) => console.log(`Error when deleting bill with ID: ${billId} `, err));
  },
);

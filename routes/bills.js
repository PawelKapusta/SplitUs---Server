import express from 'express';
export const billsRouter = express.Router();
import { Bills } from '../models/bills.js';
import { createRequire } from 'module';
import { Comments } from '../models/comments.js';
import { UsersBills } from '../models/users_bills.js';
import { v4 as uuidv4 } from 'uuid';
const require = createRequire(import.meta.url);
const passport = require('passport');

billsRouter.get('/bills', passport.authenticate('jwt', { session: false }), (req, res) => {
  Bills.findAll()
    .then((bills) => {
      res.status(200).send({
        success: 'Successfully getting bills',
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

  const bill = Bills.create({
    ID: uuidv4(),
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
  });

  try {
    await Promise.all([bill]);
    res.status(200).send({
      success: 'Successfully added bill',
    });
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
        success: 'Successfully updated bill',
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

    const allUsersBills = await UsersBills.findAll({ where: { BillId: billId } })
      .then((response) => response)
      .catch((error) =>
        console.log(`Error when finding usersBills when deleting bill with Id: ${billId}: `, error),
      );

    const usersBillsIdToDelete = allUsersBills.map((usersBills) => usersBills['ID']);

    const deleteAllCommentsPromise = Comments.destroy({ where: { ID: commentsIdToDelete } });

    const deleteAllUsersBillsPromise = UsersBills.destroy({ where: { ID: usersBillsIdToDelete } });

    const deleteBillPromise = Bills.destroy({ where: { ID: billId } });

    try {
      await Promise.all([deleteAllCommentsPromise, deleteAllUsersBillsPromise, deleteBillPromise]);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'internal server error' });
    }
  },
);

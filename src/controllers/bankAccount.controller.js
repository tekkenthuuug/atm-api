const requireAuth = require('../../middleware/authorization');
const BankAccount = require('../models/BankAccount.model');
const Transaction = require('../models/Transaction.model');
const router = require('express').Router();

const checkBalance = (req, res) => {
  /* 
    accountNo property of res.locals was set
    by authentification middleware
  */
  const { accountNo } = res.locals;
  if (!accountNo) {
    res.satus(400).send({ error: 'accountNo is missing' });
  }
  BankAccount.query()
    .where({ accountNo })
    .first()
    .then((account) => {
      res.status(200).send({ accountNo, balance: account.getBalance() });
    });
};
router.get('/balance/check', requireAuth, checkBalance);

const withdrawMoney = (req, res) => {
  const { accountNo } = res.locals;

  const { amount } = req.body;
  BankAccount.query()
    .where({ accountNo })
    .first()
    .then((account) => {
      if (!account) {
        res.status(400).send({ error: 'Account not found' });
      }

      const balanceBefore = account.getBalance();

      try {
        account.withdrawMoney(amount);
      } catch (e) {
        return res.status(400).send({ error: 'Not enought money' });
      }

      patchBalance(account, balanceBefore)
        .then(() => {
          res.status(200).send({ balance: account.getBalance() });
        })
        .catch(() => {
          res.status(400).send({ error: 'Try again later' });
        });
    });
};

router.put('/balance/withdraw', requireAuth, withdrawMoney);

const depositMoney = (req, res) => {
  const { accountNo } = res.locals;

  const { amount } = req.body;
  BankAccount.query()
    .where({ accountNo })
    .first()
    .then((account) => {
      if (!account) {
        res.status(400).send({ error: 'Account not found' });
      }
      account.depositMoney(amount);
      patchBalance(account, account.balance - amount)
        .then(() => {
          res.status(200).send({ balance: account.balance });
        })
        .catch(() => {
          res.status(400).send({ error: 'Try again later' });
        });
    });
};

router.put('/balance/deposit', requireAuth, depositMoney);

const getHistory = (req, res) => {
  const { accountNo } = res.locals;
  Transaction.query()
    .select('balance_after', 'balance_before', 'transaction_date', 'transactionID')
    .where({ accountNo })
    .orderBy('transactionID', 'DESC')
    .then((data) => {
      res.status(200).send(data);
    });
};

router.get('/balance/history', requireAuth, getHistory);

const patchBalance = (account, balanceBefore) => {
  return BankAccount.transaction((trx) => {
    trx('bank_accounts')
      .where({ accountID: account.accountID })
      .update({ balance: account.getBalance() })
      .then(() => {
        const transaction = new Transaction(account.accountNo, balanceBefore, account.getBalance());
        return trx('transactions').insert(transaction);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

module.exports = router;

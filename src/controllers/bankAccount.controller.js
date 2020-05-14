const requireAuth = require("../../middleware/authorization");
const BankAccount = require("../models/BankAccount.model");
const router = require("express").Router();

const checkBalance = (req, res) => {
  /* 
    accountNo property of res.locals was set
    by authentification middleware
  */
  const { accountNo } = res.locals;
  if (!accountNo) {
    res.satus(400).send({ error: "accountNo is missing" });
  }
  BankAccount.query()
    .where({ accountNo })
    .first()
    .then((account) => {
      res.status(200).send({ accountNo, balance: account.getBalance() });
    });
};
router.get("/balance/check", requireAuth, checkBalance);

const withdrawMoney = (req, res) => {
  const { accountNo } = res.locals;

  const { amount } = req.body;
  BankAccount.query()
    .where({ accountNo })
    .first()
    .then((account) => {
      if (!account) {
        res.status(400).send({ error: "Account not found" });
      }
      try {
        account.withdrawMoney(amount);
      } catch (e) {
        return res.status(400).send({ error: "Not enought money" });
      }
      patchAccount(account)
        .then(() => {
          res.status(200).send({ balance: account.balance });
        })
        .catch(() => {
          res.status(400).send({ error: "Try again later" });
        });
    });
};

router.put("/balance/withdraw", requireAuth, withdrawMoney);

const depositMoney = (req, res) => {
  const { accountNo } = res.locals;

  const { amount } = req.body;
  BankAccount.query()
    .where({ accountNo })
    .first()
    .then((account) => {
      if (!account) {
        res.status(400).send({ error: "Account not found" });
      }
      account.depositMoney(amount);
      patchAccount(account)
        .then(() => {
          res.status(200).send({ balance: account.balance });
        })
        .catch(() => {
          res.status(400).send({ error: "Try again later" });
        });
    });
};

router.put("/balance/deposit", requireAuth, depositMoney);

const patchAccount = (account) => {
  return BankAccount.query()
    .where({ accountID: account.accountID })
    .patch(account);
};

module.exports = router;

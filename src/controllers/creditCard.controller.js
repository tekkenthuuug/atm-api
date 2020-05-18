const jwt = require('jsonwebtoken');
const CreditCard = require('../models/CreditCard.model');
const CreditCardEvents = require('../models/CreditCardEvent.model');
const requireAuth = require('../../middleware/authorization');
const router = require('express').Router();

const verifyCard = async (req, res) => {
  const { cardNo, pin } = req.body;
  if (!cardNo || !pin) {
    return res.sendStatus(400);
  }

  const creditCard = await CreditCard.query().where({ cardNo }).first().execute();

  if (!creditCard) {
    return res.status(404).send({ error: 'Credit card not found' });
  }

  if (creditCard.hasExpired()) {
    return res.status(200).send({ error: 'Card has expired' });
  }

  if (creditCard.isBlocked().blockedDate) {
    return res.status(200).send({
      error: `Card is blocked. Please contact your card issuer`,
    });
  }

  const isPinValid = creditCard.isPinValid(pin);
  const { isValid } = isPinValid;
  let { hasChangedScore } = isPinValid;

  if (isValid) {
    const { accountNo, cardNo } = creditCard;
    const token = jwt.sign({ accountNo, cardNo }, 'secret', { expiresIn: '15m' });
    if (token) {
      res.status(200).send({ token: token });
    } else {
      res.status(500).send({ error: 'An error occured. Try again later' });
    }
  } else {
    const hasBeenBlocked = creditCard.handleFailure();
    if (hasBeenBlocked) {
      res.status(200).send({
        error: 'Your card has been blocked. Please contact your card issuer',
      });
    } else {
      res.status(200).send({ error: 'Wrong PIN' });
    }
    hasChangedScore = true;
  }

  if (hasChangedScore) {
    patchCreditCard(creditCard);
  }
};

router.post('/creditcard/verify', verifyCard);

const getHistory = (req, res) => {
  const { cardNo } = res.locals;
  CreditCardEvents.query()
    .where({ cardNo })
    .then((data) => {
      res.status(200).send(data);
    });
};

router.get('/creditcard/history', requireAuth, getHistory);

const patchCreditCard = (creditCard) => {
  return CreditCard.query()
    .where({ cardID: creditCard.cardID })
    .patch(creditCard)
    .then(() => {});
};

module.exports = router;

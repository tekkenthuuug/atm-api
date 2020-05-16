const jwt = require('jsonwebtoken');
const CreditCard = require('../models/CreditCard.model');
const router = require('express').Router();

const verifyCard = (req, res) => {
  const { cardNo, pin } = req.body;
  if (!cardNo || !pin) {
    return res.sendStatus(400);
  }

  CreditCard.query()
    .where({ cardNo })
    .first()
    .then((creditCard) => {
      if (!creditCard) {
        return res.status(404).send({ error: 'Credit card not found' });
      }

      if (creditCard.hasExpired()) {
        return res.status(200).send({ error: 'Card has expired' });
      }

      const { isBlocked } = creditCard.isBlocked();

      if (isBlocked) {
        return res.status(200).send({
          error: `Card is blocked. Please contact your card issuer`,
        });
      }

      const isPinValid = creditCard.isPinValid(pin);
      const { isValid } = isPinValid;
      let { hasChangedScore } = isPinValid;

      if (isValid) {
        const { accountNo } = creditCard;
        jwt.sign({ accountNo }, 'secret', { expiresIn: '15m' }, (err, token) => {
          if (!err && token) {
            res.status(200).send({ token: token });
          } else {
            res.status(500).send({ error: 'An error occured. Try again later' });
          }
        });
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
    });
};

const patchCreditCard = (creditCard) => {
  return CreditCard.query()
    .where({ cardID: creditCard.cardID })
    .patch(creditCard)
    .then(() => {});
};

router.post('/verifycard', verifyCard);

module.exports = router;

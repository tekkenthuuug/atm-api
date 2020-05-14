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

      if (creditCard.isBlocked()) {
        return res
          .status(200)
          .send({ error: 'Card is blocked. Please contact your card issuer' });
      }

      const { isValid, hasDroppedFailureScore } = creditCard.isPinValid(pin);
      let hasChangedScore = false;

      if (isValid) {
        const { accountNo } = creditCard;
        jwt.sign(
          { accountNo },
          'secret',
          { expiresIn: '15m' },
          (err, token) => {
            if (!err && token) {
              res.status(200).send({ token: token });
            } else {
              res
                .status(500)
                .send({ error: 'An error occured. Try again later' });
            }
          }
        );
      } else {
        const hasBeenBlocked = creditCard.handleFailure();
        if (hasBeenBlocked) {
          res.status(200).send({
            error:
              'Your card has been blocked. Please contact your card issuer',
          });
        } else {
          res.status(200).send({ error: 'Wrong PIN' });
        }
        hasChangedScore = true;
      }
      if (hasChangedScore || hasDroppedFailureScore) {
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

const debug = (req, res) => {
  CreditCard.query().then((data) => {
    res.status(200).send(data);
  });
};

router.get('/debug', debug);

router.post('/verifycard', verifyCard);

module.exports = router;

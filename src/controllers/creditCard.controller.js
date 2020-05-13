const CreditCard = require("../models/CreditCard.model");
const router = require("express").Router();

const verifyCard = (req, res) => {
  const { cardNo, pin } = req.body;
  if (!cardNo || !pin) {
    res.sendStatus(400);
  }

  CreditCard.query()
    .where({ cardNo })
    .first()
    .then((creditCard) => {
      if (!creditCard) {
        return res.status(400).send({ error: "Credit card not found" });
      }

      creditCard
        .verifyAll(pin)
        .then(() => {
          // @togo genereate token
          const { accountNo } = creditCard;
          res.status(200).send({ token: "token", accountNo });
        })
        .catch((err) => {
          res.status(400).send({ error: err });
        });
    });
};

router.post("/verifycard", verifyCard);

module.exports = router;

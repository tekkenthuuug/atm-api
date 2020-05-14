const jwt = require("jsonwebtoken");
const CreditCard = require("../models/CreditCard.model");
const router = require("express").Router();

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
        return res.status(400).send({ error: "Credit card not found" });
      }

      creditCard
        .verifyAll(pin)
        .then(() => {
          const { accountNo } = creditCard;
          jwt.sign(
            { accountNo },
            "secret",
            { expiresIn: "15m" },
            (err, token) => {
              if (!err && token) {
                return res.status(200).send({ token: token });
              } else {
                res
                  .status(400)
                  .send({ error: "An error occured. Try again later" });
              }
            }
          );
        })
        .catch((err) => {
          res.status(200).send({ error: err });
        });
    });
};

router.post("/verifycard", verifyCard);

module.exports = router;

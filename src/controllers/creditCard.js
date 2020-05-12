const verifyCard = (db, bcrypt) => (req, res) => {
  const { cardNo, pin } = req.body;
  if (!cardNo || !pin) {
    res.sendStatus(400);
  }

  db.from("credit_cards")
    .select("hash_pin", "expired_date")
    .where({ cardNo })
    .then((data) => {
      if (!data[0]) {
        return res.status(200).send({ error: "Card numnber is incorrect" });
      }
      const { hash_pin: hashPin, expired_date: expDate } = data[0];
      validateCard(pin, hashPin, expDate, bcrypt)
        .then(() => {
          // @todo generate jwt token
          res.status(200).send({ token: "token" });
        })
        .catch((err) => {
          res.status(200).send({ error: err });
        });
    });
};

const validateCard = (pin, hashPin, expDate, bcrypt) => {
  return new Promise((resolve, reject) => {
    if (expDate < new Date()) {
      reject("Card has expired");
    }
    const isPinValid = bcrypt.compareSync(pin, hashPin);
    if (isPinValid) {
      resolve();
    } else {
      reject("Wrong PIN");
    }
  });
};

module.exports = {
  verifyCard,
};

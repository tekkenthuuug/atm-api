const { Model } = require("objection");
const bcrypt = require("bcryptjs");
const knex = require("../../db/knex");

Model.knex(knex);

class CreditCard extends Model {
  static get tableName() {
    return "credit_cards";
  }

  static get relationMappings() {
    const BankAccount = require("./BankAccount.model");

    return {
      accounts: {
        relation: Model.HasOneRelation,
        modelClass: BankAccount,
        join: {
          from: "credit_cards.accountNo",
          to: "bank_accounts.accountNo",
        },
      },
    };
  }

  verifyPin(pin) {
    return bcrypt.compareSync(pin, this.hash_pin);
  }

  verifyExpiredDate() {
    return this.expired_date > new Date();
  }

  verifyAll(pin) {
    return new Promise((resolve, reject) => {
      if (!this.verifyExpiredDate()) {
        reject("Card has expired");
      }
      if (!this.verifyPin(pin)) {
        reject("Wrong PIN");
      }
      resolve();
    });
  }
}

module.exports = CreditCard;

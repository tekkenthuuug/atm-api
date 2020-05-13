const { Model } = require("objection");
const knex = require("../../db/knex");

Model.knex(knex);

class BankAccount extends Model {
  static get tableName() {
    return "bank_accounts";
  }

  getBalance() {
    return this.balance;
  }

  withdrawMoney(amount) {
    if (Number(this.balance) < Number(amount)) {
      throw new Error("Not enought money");
    }
    this.balance -= amount;
    return this.balance;
  }

  depositMoney(amount) {
    this.balance = Number(this.balance) + Number(amount);
    return this.balance;
  }

  static get relationMappings() {
    const CreditCard = require("./CreditCard.model");
    return {
      cards: {
        relation: Model.HasOneRelation,
        modelClass: CreditCard,
        join: {
          from: "bank_accounts.accountNo",
          to: "credit_cards.accountNo",
        },
      },
    };
  }
}

module.exports = BankAccount;

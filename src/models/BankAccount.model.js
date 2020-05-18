const { Model } = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class BankAccount extends Model {
  static get tableName() {
    return 'bank_accounts';
  }

  static get relationMappings() {}

  getBalance() {
    return this.balance;
  }

  withdrawMoney(amount) {
    if (Number(this.balance) < Number(amount)) {
      throw new Error('Not enought money');
    }
    this.balance -= amount;
    return this.balance;
  }

  depositMoney(amount) {
    this.balance = Number(this.balance) + Number(amount);
    return this.balance;
  }
}

module.exports = BankAccount;

const { Model } = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class Transaction extends Model {
  constructor(accountNo, balanceBefore, balanceAfter) {
    super();
    this.accountNo = accountNo;
    this.balance_after = balanceAfter;
    this.balance_before = balanceBefore;
    this.transaction_date = new Date();
  }

  static get tableName() {
    return 'transactions';
  }
}

module.exports = Transaction;

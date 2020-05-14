const { Model } = require('objection');
const bcrypt = require('bcryptjs');
const knex = require('../../db/knex');

Model.knex(knex);

class CreditCard extends Model {
  static get tableName() {
    return 'credit_cards';
  }

  static get relationMappings() {
    const BankAccount = require('./BankAccount.model');

    return {
      accounts: {
        relation: Model.HasOneRelation,
        modelClass: BankAccount,
        join: {
          from: 'credit_cards.accountNo',
          to: 'bank_accounts.accountNo',
        },
      },
    };
  }

  isPinValid(pin) {
    const isValid = bcrypt.compareSync(pin, this.hash_pin);
    let hasDroppedFailureScore = false;

    if (isValid && this.failure_score !== 0) {
      this.failure_score = 0;
      hasDroppedFailureScore = true;
    }

    return { isValid, hasDroppedFailureScore };
  }

  hasExpired() {
    return this.expired_date.valueOf() < new Date().valueOf();
  }

  isBlocked() {
    return this.is_blocked;
  }

  /**
   * @returns True if card was blocked
   */
  handleFailure() {
    if (this.failure_score < 2) {
      // Increase failure score and set new last_failure date
      this.failure_score += 1;
      this.last_failure = new Date();
      return false;
    } else {
      // Increase failure and block card
      this.failure_score = 3;
      this.is_blocked = true;
      return true;
    }
  }
}

module.exports = CreditCard;

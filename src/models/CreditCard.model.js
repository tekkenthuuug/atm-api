const { Model } = require('objection');
const bcrypt = require('bcryptjs');
const knex = require('../../db/knex');
const CreditCardEvent = require('./CreditCardEvent.model');

Model.knex(knex);

class CreditCard extends Model {
  static get tableName() {
    return 'credit_cards';
  }

  static get relationMappings() {}

  isPinValid(pin) {
    const isValid = bcrypt.compareSync(pin, this.hash_pin);
    let hasChangedScore = false;

    if (isValid) {
      this.insertCreditCardEvent('Authorized');
      if (this.failure_score !== 0) {
        this.failure_score = 0;
        hasChangedScore = true;
      }
    }

    return { isValid, hasChangedScore };
  }

  hasExpired() {
    return this.expired_date.valueOf() < new Date().valueOf();
  }

  isBlocked() {
    if (this.is_blocked) {
      return {
        isBlocked: true,
        blockedDate: this.blocked_date,
      };
    }
    return { isBlocked: false };
  }

  /**
   * @returns True if card was blocked
   */
  handleFailure() {
    if (this.failure_score < 2) {
      // Increase failure score and set new last_failure date
      this.insertCreditCardEvent('Failure');
      this.failure_score += 1;
      return false;
    } else {
      // Increase failure and block card
      this.insertCreditCardEvent('Blocked');
      this.failure_score = 3;
      this.is_blocked = true;
      this.blocked_date = new Date();
      return true;
    }
  }

  insertCreditCardEvent = (eventName) => {
    const creditCardEvent = new CreditCardEvent(this.cardNo, eventName);
    CreditCardEvent.query().insert(creditCardEvent).returning('*').execute();
  };
}

module.exports = CreditCard;

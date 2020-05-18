const { Model } = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class CreditCardEvent extends Model {
  constructor(cardNo, eventName) {
    super();
    this.cardNo = cardNo;
    this.event_name = eventName;
    this.event_date = new Date();
  }

  static get tableName() {
    return 'credit_cards_events';
  }
}

module.exports = CreditCardEvent;

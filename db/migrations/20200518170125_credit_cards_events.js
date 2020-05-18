exports.up = function (knex) {
  return knex.schema.createTable('credit_cards_events', (t) => {
    t.increments('eventID');
    t.bigInteger('cardNo').references('credit_cards.cardNo').onDelete('CASCADE');
    t.text('event_name').references('credit_cards_events_names.event_name').onDelete('CASCADE');
    t.dateTime('event_date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('credit_cards_events');
};

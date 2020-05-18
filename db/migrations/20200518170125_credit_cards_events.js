exports.up = function (knex) {
  return knex.schema.createTable('credit_cards_events', (t) => {
    t.bigInteger('cardID').references('credit_cards.cardID').onDelete('CASCADE');
    t.text('event_name').references('credit_cards_events_names.event_name').onDelete('CASCADE');
    t.date('event_date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('credit_cards_events');
};

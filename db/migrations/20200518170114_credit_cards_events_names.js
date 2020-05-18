exports.up = function (knex) {
  return knex.schema.createTable('credit_cards_events_names', (t) => {
    t.text('event_name').notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('credit_cards_events_names');
};

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('credit_cards_events_names')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('credit_cards_events_names').insert([
        { event_name: 'Blocked' },
        { event_name: 'Failure' },
        { event_name: 'Authorized' },
      ]);
    });
};

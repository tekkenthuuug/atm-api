exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('credit_cards_events')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('credit_cards_events').insert([
        {
          cardID: 1,
          event_name: 'Authorized',
          event_date: new Date(),
        },
      ]);
    });
};

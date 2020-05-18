exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('credit_cards_events')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('credit_cards_events').insert([
        {
          cardNo: 1234567890123456,
          event_name: 'Authorized',
          event_date: new Date(),
        },
      ]);
    });
};

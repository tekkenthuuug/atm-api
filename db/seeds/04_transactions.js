exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('transactions')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('transactions').insert([
        { accountNo: 93210000440021, balance_before: 143.22, balance_after: 123.22, transaction_date: new Date() },
      ]);
    });
};

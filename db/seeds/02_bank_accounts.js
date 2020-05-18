exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('bank_accounts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('bank_accounts').insert([
        { accountID: 1, customerID: 1, accountNo: 93210000440021, balance: 123.22 },
        { accountID: 2, customerID: 2, accountNo: 93210000440024, balance: 1500.2 },
        { accountID: 3, customerID: 3, accountNo: 93210000440020, balance: 30300.2 },
      ]);
    });
};

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('bank_accounts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('bank_accounts').insert([
        { customerID: 1, accountNo: 93210000440021, balance: 123.22 },
        { customerID: 2, accountNo: 93210000440024, balance: 1500.2 },
        { customerID: 3, accountNo: 93210000440020, balance: 30300.2 },
      ]);
    });
};

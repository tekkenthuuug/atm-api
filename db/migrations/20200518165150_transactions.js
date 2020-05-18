exports.up = function (knex) {
  return knex.schema.createTable('transactions', (t) => {
    t.increments('transactionID').primary();
    t.bigInteger('accountNo').notNullable().references('bank_accounts.accountNo').onDelete('CASCADE');
    t.decimal('balance_before', 10, 2);
    t.decimal('balance_after', 10, 2);
    t.dateTime('transaction_date').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions');
};

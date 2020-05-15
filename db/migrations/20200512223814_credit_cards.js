exports.up = function (knex) {
  return knex.schema.createTable('credit_cards', (t) => {
    t.increments('cardID').primary();
    t.bigInteger('cardNo').notNullable().unique();
    t.date('expired_date').notNullable().defaultTo(knex.fn.now());
    t.text('accountNo', 30).notNullable().references('bank_accounts.accountNo');
    t.bigInteger('customerID').notNullable().references('customers.customerID');
    t.integer('CVV').notNullable();
    t.text('card_holder', 100).notNullable();
    t.text('hash_pin', 60).notNullable();
    t.text('card_type', 20).notNullable();
    t.specificType('failure_score', 'smallint').defaultTo(0);
    t.boolean('is_blocked').defaultTo(false);
    t.date('blocked_date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('credit_cards');
};

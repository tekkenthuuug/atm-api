exports.up = function (knex) {
  return knex.schema.createTable("bank_accounts", (t) => {
    t.increments("accountID").primary();
    t.integer("customerID").references("customers.customerID");
    t.text("accountNo", 30).notNullable().unique();
    t.decimal("balance", 10, 2);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bank_accounts");
};

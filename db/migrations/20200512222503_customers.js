exports.up = function (knex) {
  return knex.schema.createTable("customers", (t) => {
    t.increments("customerID").primary();
    t.string("name", 50);
    t.string("surename", 50);
    t.bigInteger("phoneNo");
    t.string("address", 150);
    t.bigInteger("personalID").notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("customers");
};

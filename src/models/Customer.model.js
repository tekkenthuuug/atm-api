const { Model } = require("objection");
const BankAccount = require("./BankAccount.model");
const knex = require("../../db/knex");

Model.knex(knex);

class Customer extends Model {
  static get tableName() {
    return "customers";
  }

  static get relationMappings() {}
}

module.exports = Customer;

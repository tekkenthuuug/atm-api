const express = require("express");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const bankAccount = require("./src/controllers/creditCard");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

const db = knex({
  client: "pg",
  connection: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
});

app.post("/verifyCard", bankAccount.verifyCard(db, bcrypt));

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});

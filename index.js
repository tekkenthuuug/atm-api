const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const creditCardRouter = require("./src/controllers/creditCard.controller");
const bankAccountRouter = require("./src/controllers/bankAccount.controller");
const customerRouter = require("./src/controllers/customer.controller");

// Creating an express app
const app = express();

// Parsing post request body
app.use(bodyParser.json());
// CORS
app.use(cors());
app.use(helmet());
// Logging
app.use(morgan("combined"));

// Routes
app.use(creditCardRouter);
app.use(bankAccountRouter);
app.use(customerRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});

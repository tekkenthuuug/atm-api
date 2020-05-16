exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('credit_cards')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('credit_cards').insert([
        {
          cardNo: 1234567890123456,
          expired_date: new Date(2021, 3, 15),
          accountNo: 93210000440021,
          customerID: 1,
          CVV: 666,
          card_holder: 'Maksim Pautsina',
          hash_pin: '$2a$10$wZOfDAvkW.4YWY5cXIt6V.u6ODeaxMHBKMLuUx2FG6h8uexXS30LS',
          card_type: 'Visa',
        },
        {
          cardNo: 1234567890123999,
          expired_date: new Date(2022, 10, 15),
          accountNo: 93210000440024,
          customerID: 2,
          CVV: 666,
          card_holder: 'Alexey Kharchenko',
          hash_pin: '$2a$10$wZOfDAvkW.4YWY5cXIt6V.u6ODeaxMHBKMLuUx2FG6h8uexXS30LS',
          card_type: 'Visa',
        },
        {
          cardNo: 1234567890123333,
          expired_date: new Date(2019, 3, 15),
          accountNo: 93210000440020,
          customerID: 3,
          CVV: 666,
          card_holder: 'Yehor Kolohoida',
          hash_pin: '$2a$10$wZOfDAvkW.4YWY5cXIt6V.u6ODeaxMHBKMLuUx2FG6h8uexXS30LS',
          card_type: 'Visa',
        },
      ]);
    });
};

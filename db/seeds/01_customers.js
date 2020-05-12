exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("customers")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("customers").insert([
        {
          name: "Maksim",
          surename: "Pautsina",
          phoneNo: 48577533222,
          address: "Poland, Warsaw",
          personalID: 00444333222,
        },
        {
          name: "Alexey",
          surename: "Kharchenko",
          phoneNo: 48577533221,
          address: "Poland, Warsaw",
          personalID: 00444333223,
        },
        {
          name: "Yehor",
          surename: "Kolohoida",
          phoneNo: 48577533223,
          address: "Poland, Warsaw",
          personalID: 00444333224,
        },
      ]);
    });
};

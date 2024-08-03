'use strict';

const { Review } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await Review.bulkCreate([
    {
      spotId: 1,
      userId: 3,
      review: 'Amazing place! Really enjoyed my stay.',
      stars: 5
    },
    {
      spotId: 2,
      userId: 3,
      review: 'The location was perfect, but the service could be better.',
      stars: 3
    },
    {
      spotId: 3,
      userId: 1,
      review: 'Had a fantastic experience. Will visit again.',
      stars: 4
    },
    {
      spotId: 3,
      userId: 2,
      review: 'Terrible place, do not rent.',
      stars: 1
    }
   ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};

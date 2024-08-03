'use strict';

const {Booking} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await Booking.bulkCreate([
  {
    spotId: 1,
    userId: 3,
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-05')
  },
  {
    spotId: 2,
    userId: 1,
    startDate: new Date('2024-10-10'),
    endDate: new Date('2024-10-15')
  },
  {
    spotId: 3,
    userId: 2,
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-05')
  }
   ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

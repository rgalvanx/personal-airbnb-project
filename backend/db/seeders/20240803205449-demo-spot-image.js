'use strict';
const {SpotImage} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://example.com/beach.jpg',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://example.com/beach2.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://example.com/mountain.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://example.com/mountain2.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://example.com/lake.jpg',
        preview: true,
      }
    ], {validate: true})

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in] : [1,2,3] }
    })
  }
};

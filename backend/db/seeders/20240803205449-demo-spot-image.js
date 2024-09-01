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
        url: 'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465200_0q7Of6UnbA8kDlYEe3a4PuIyue27fbuV.jpg',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465215_r27BiUidQB8nEi11MTrl3STO0gUQazRI.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465272_yVSHzzIfxMbTPWtyTbOXVMMa9oil3Wcr.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465255_Df7b0xhRhX72rqgWrfM5iFsL0UAx00E3.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://as1.ftcdn.net/v2/jpg/01/18/46/52/1000_F_118465224_nCF1bI0UDwsZcc30vA39XBH90NbtXOlA.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://as1.ftcdn.net/v2/jpg/02/95/71/38/1000_F_295713811_ilg5EbeLqu7RvzKpJrEgCfneLjTZ1xja.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://as2.ftcdn.net/v2/jpg/02/35/84/73/1000_F_235847393_7VOV7sNMBKiCNR4gltw9LLEKG4hgioYg.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://t4.ftcdn.net/jpg/02/64/03/27/240_F_264032798_QX8zYXMysoSb9FzYYflv8TydIPVIyLpE.webp',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://t3.ftcdn.net/jpg/01/41/46/60/240_F_141466025_pP1zE1BRRcKLM4DilPpEoQdtS8wIWxTB.webp',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://as2.ftcdn.net/v2/jpg/01/56/17/93/1000_F_156179307_k9NY5zUvbnj1DpiFcT5zapCZxClWCsQn.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://as2.ftcdn.net/v2/jpg/03/70/64/43/1000_F_370644357_MDF4UXLAXTyyi2OyuK66tWW9cA2f8svL.jpg',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://t4.ftcdn.net/jpg/03/70/64/43/240_F_370644367_dMl3a9o85ebGmF21IMHyEsDF4EQglXhF.webp',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://t4.ftcdn.net/jpg/03/70/64/43/240_F_370644384_eOWWJF5I7PYJviuCisdm8yDnmIJBY1R2.webp',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://t4.ftcdn.net/jpg/03/70/64/43/240_F_370644342_doMy80NwFA5HCF79x8OlYwESVLoIEaKh.webp',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://t4.ftcdn.net/jpg/03/71/03/49/240_F_371034923_UuWG6rr4dVwMD8XvZV1Yq31TyZlY7aSR.webp',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://as1.ftcdn.net/v2/jpg/03/57/26/10/1000_F_357261042_XBZSFWHgtz2pUlE8lztPiNyZBr1WzX1M.jpg',
        preview: true,
      },
      {
        spotId: 4,
        url: 'https://t3.ftcdn.net/jpg/03/57/26/08/240_F_357260838_GS2zWUf4bqvyf9uyRBofBiv7pfSzq28w.webp',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://t3.ftcdn.net/jpg/03/57/26/06/240_F_357260636_dp0Ii5jQKlZJ90ZMk4b970qkTqxswbBQ.webp',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://t4.ftcdn.net/jpg/03/57/26/07/240_F_357260760_xy3LGUQ94wv7pY02IKIcSewO1RKyIJe6.webp',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://t4.ftcdn.net/jpg/03/57/26/07/240_F_357260767_hEOTAP8tlhMzYscPFW4PubyVov7RR2hz.jpg',
        preview: false,
      },
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

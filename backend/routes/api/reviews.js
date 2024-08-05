const express = require('express');
const router = express.Router();
const {Spot, User, Review, ReviewImage, SpotImage} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {previewImageFormatter, avgRatingFormatter} = require('../../utils/formatters')

router.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const reviews = await Review.findAll({
    where: {
      userId
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    },

    {
      model: Spot,
      attributes: ['id', 'ownerId', "address", "city", "state", "country", "lat", "lng", "name", "price"],
      include: {
        model: SpotImage,
      }
    },
    {
      model: ReviewImage,
      attributes: ['id', 'url']
    }
  ]
  });
  reviews.forEach((review) => previewImageFormatter(review.dataValues.Spot));
  return res.json({Reviews: reviews})
})




module.exports = router;

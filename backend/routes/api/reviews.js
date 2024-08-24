const express = require('express');
const router = express.Router();
const {Spot, User, Review, ReviewImage, SpotImage} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {previewImageFormatter, avgRatingFormatter} = require('../../utils/formatters')

const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage('Review text is required'),
  check('stars')
    .exists({checkFalsy: true})
    .isInt({min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const userId = req.user.id
  const {reviewId} = req.params

  const review = await Review.findByPk(reviewId, {
    include: [{
      model: ReviewImage
    }]
  });
  if(!review) {
    return res.status(404).json({"message": "Review couldn't be found"})
  }
  if(userId !== review.dataValues.userId) {
    return res.status(403).json({"message":"Forbidden"})
  }
  if(review.ReviewImages.length >= 10) {
    return res.status(403).json({"message": "Maximum number of images for this resource was reached"})
  }
  const {id, url} = await review.createReviewImage(req.body);
  return res.status(201).json({id, url})
})

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const userId = req.user.id;
  const {reviewId} = req.params;
  const review = await Review.findByPk(reviewId);
  if(!review) {
    return res.status(404).json({"message": "Review couldn't be found"})
  }
  if(userId !== review.dataValues.userId) {
    return res.status(403).json({"message":"Forbidden"})
  }
  const updatedReview = await review.update(req.body)
  return res.json(updatedReview)
})

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const {reviewId} = req.params
  const userId = req.user.id
  const review = await Review.findByPk(reviewId);
  if(!review) {
    return res.status(404).json({"message": "Review couldn't be found"})
  }
  if(userId !== review.dataValues.userId) {
    return res.status(403).json({"message":"Forbidden"})
  }
  await review.destroy();
  return res.json({"message": "Successfully deleted"})
})

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

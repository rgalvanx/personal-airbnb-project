const express = require('express');
const router = express.Router();
const {Spot, User, SpotImage, Review, ReviewImage, Booking} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {previewImageFormatter, avgRatingFormatter} = require('../../utils/formatters')
const { checkTodays } = require('../../utils/bookingsValidators')

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({min: -90.0, max: 90.0})
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({min: -180.0, max: 180.0})
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({min: 1, max: 50})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({min: .01})
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

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

//CREATE A BOOKING FROM SPOT BASED ON SPOTID
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body
  if(checkTodays(startDate)) {
    return res.status(400).json({
      'message': 'Bad Request',
      'startDate': 'startDate cannot be in the past'
    })
  }
  const spot = await Spot.findByPk(spotId, {
    include: [{
      model: Booking,
    }]
  })
  return res.json(spot)
})

//GET BOOKINGS BT SPOTID
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId, {
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    },
    {
      model: Booking
    }
  ]
  })
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  if(userId === spot.dataValues.ownerId) {
    const bookings = [];
    spot.dataValues.Bookings.forEach((booking) => {
      const User = spot.dataValues.User
      const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } = booking.dataValues;
      bookings.push({ User, id, spotId, userId, startDate, endDate, createdAt, updatedAt });
    })
    return res.json({Bookings: bookings})
  }
  if(userId !== spot.dataValues.ownerId) {
    const bookings = [];
    spot.dataValues.Bookings.forEach((booking) => {
      const { spotId, startDate, endDate } = booking.dataValues;
      bookings.push({ spotId, startDate, endDate})
    })
    return res.json({Bookings: bookings})
  }

  return res.json(spot)
})

//GET REVIEWS BY SPOT ID
router.get('/:spotId/reviews', async(req, res, next) => {
  const {spotId} = req.params;
  const spot = await Spot.findByPk(spotId, {
    include: [{
        model: Review,
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }, {
            model: ReviewImage,
            attributes: ['id', 'url']
        }]
      }]
  })
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  return res.json({Reviews: spot.dataValues.Reviews})
})

//ADD REVIEW TO SPOT
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const {spotId} = req.params;
  const userId = req.user.id
  const spot = await Spot.findByPk(spotId, {
    include: {
      model: Review
    }
  })
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  spot.dataValues.Reviews.forEach((review) => {
    if(review.userId === userId) {
      return res.status(500).json({"message": "User already has a review for this spot"})
    }
  })
  const newReview = await spot.createReview({...req.body, userId})
  return res.json(newReview);

 })

//ADD AN IMAGE TO A SPOT
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const {spotId} = req.params;
  const spot = await Spot.findByPk(spotId);
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  if(req.user.dataValues.id !== spot.dataValues.ownerId) {
    return res.status(403).json({"message": "Forbidden"})
  }
  const image = await spot.createSpotImage(req.body)
  const {id, url, preview} = image
  res.json({id, url, preview})
})

//RETURNS THE CURRENT USERS SPOTS
router.get('/current', requireAuth, async (req, res, next) => {
  const id = req.user.id;
  const userSpots = await Spot.findAll({
    where: {
      ownerId: id
    },
    include: [{
      model: SpotImage,
    },
    {
      model: Review,
    }
  ]
  })
  userSpots.forEach(spot => previewImageFormatter(spot))
  userSpots.forEach(spot => avgRatingFormatter(spot))
  return res.json({Spots: userSpots});
})

//EDIT A SPOT
router.put('/:spotId', requireAuth, validateSpot, async(req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  if(req.user.dataValues.id !== spot.dataValues.ownerId) {
    return res.status(403).json({"message": "Forbidden"})
  }
  const updatedSpot = await spot.update(req.body)
  res.json(updatedSpot)
})

//DELETE A SPOT
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  if(req.user.dataValues.id !== spot.dataValues.ownerId) {
    return res.status(403).json({"message": "Forbidden"})
  }
  await spot.destroy();
  res.json({"message": "Successfully deleted"})
})

//GET SPOT BY SPOT ID
router.get('/:spotId', async (req, res, next) => {
  const {spotId} = req.params;
  let spot = await Spot.findByPk(spotId, {
    include: [{
      model: Review,
      attributes: ['stars']
    },
    {
      model: SpotImage,
      attributes: ['id', 'url', 'preview']
    },
    {
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    },
  ]
  });
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  spot.dataValues.numReviews = spot.dataValues.Reviews.length;
  avgRatingFormatter(spot)
  spot.dataValues.Owner = spot.dataValues.User;
  delete spot.dataValues.User;
  return res.json(spot);
})

//GET ALL SPOTS
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [{
      model: Review,
      attributes: ['stars']
    },
    {
      model: SpotImage,
      attributes: ['id', 'url', 'preview']
    },
  ]
  });

  spots.forEach(spot => previewImageFormatter(spot))
  spots.forEach(spot => avgRatingFormatter(spot))
  return res.json({
    Spots:spots
  });
})
//POST A NEW SPOT
router.post('/', requireAuth, validateSpot, async(req, res, next) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body;
  const ownerID = req.user.id;
  const user = await User.findByPk(ownerID);
  const newSpot = await user.createSpot({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })
  return res.status(201).json(newSpot);
})

module.exports = router;

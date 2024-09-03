const express = require('express');
const router = express.Router();
const {Spot, User, SpotImage, Review, ReviewImage, Booking} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {previewImageFormatter, avgRatingFormatter} = require('../../utils/formatters')
const { checkParams, bookingConflict } = require('../../utils/bookingsValidators')
const { queryFormatter } = require('../../utils/queryPagination')
const { Op } = require('sequelize')

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  // check('lat')
  //   .exists({ checkFalsy: true })
  //   .isFloat({min: -90.0, max: 90.0})
  //   .withMessage('Latitude must be within -90 and 90'),
  // check('lng')
  //   .exists({ checkFalsy: true })
  //   .isFloat({min: -180.0, max: 180.0})
  //   .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({min: 1, max: 50})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({min: 0.01})
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

const validateQuery = [
  query('page')
    .optional()
    .isInt({min: 1})
    .withMessage('Page must be greater than or equal to 1'),
  query('size')
    .optional()
    .isInt({min: 1, max: 20})
    .withMessage('Size must be between 1 and 20'),
  // query('maxLat')
  //   .optional()
  //   .isFloat({max: 90.0})
  //   .withMessage('Maximum latitude is invalid'),
  // query('minLat')
  //   .optional()
  //   .isFloat({min: -90.0})
  //   .withMessage('Minimum latitude is invalid'),
  // query('minLng')
  //   .optional()
  //   .isFloat({min: -180.0})
  //   .withMessage('Minimum longitude is invalid'),
  // query('maxLng')
  //   .optional()
  //   .isFloat({max: 180.0})
  //   .withMessage('Maximum longitude is invalid'),
  query('minPrice')
    .optional()
    .isFloat({min: 0.0})
    .withMessage('Minimum price must be greater than or equal to 0'),
  query('maxPrice')
    .optional()
    .isFloat({min: 0.0})
    .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
]

//CREATE A BOOKING FROM SPOT BASED ON SPOTID
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body
  const userId  =  req.user.id
  const errors = checkParams(startDate, endDate);
  if(errors.startDate || errors.endDate) {
    return res.status(400).json({
      'message': 'Bad Request',
      errors
    })
  }
  const spot = await Spot.findByPk(spotId, {
    include: [{
      model: Booking,
    }]
  })
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  if(userId === spot.dataValues.ownerId) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }

  for(let i = 0; i < spot.dataValues.Bookings.length; i ++) {
    const booking = spot.dataValues.Bookings[i];
    const errors = bookingConflict(startDate, endDate, booking.startDate, booking.endDate)
    if(errors.startDate || errors.endDate) {
      return res.status(403).json({
        'message': "Sorry, this spot is already booked for the specified dates",
        errors
      })
    }
  }

  const newBooking = await spot.createBooking({userId, startDate, endDate})
  return res.status(201).json(newBooking)
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
      model: Booking,
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }]
    }
  ]
  })
  if(!spot) {
    return res.status(404).json({"message": "Spot couldn't be found"})
  }
  ///I think we may be adding the wrong user to the return bookings
  if(userId === spot.dataValues.ownerId) {
    const bookings = [];
    spot.dataValues.Bookings.forEach((booking) => {
      const { User, id, spotId, userId, startDate, endDate, createdAt, updatedAt } = booking.dataValues;
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
  let alreadyReviewed = false;
  spot.dataValues.Reviews.forEach((review) => {
    if(review.userId === userId) {
      alreadyReviewed = true;
    }
  })
  if(alreadyReviewed) return res.status(500).json({"message": "User already has a review for this spot"})
  const newReview = await spot.createReview({...req.body, userId})
  return res.status(201).json(newReview);

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
  if(req.body.preview === true) {
    const spotImage = await SpotImage.findOne({
      where: {
        spotId,
        preview: true
      }
    })
    if(spotImage){
      spotImage.preview = false;
      await spotImage.save()
    }
  }
  const image = await spot.createSpotImage(req.body)
  const {id, url, preview} = image
  return res.status(201).json({id, url, preview})
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
  return res.json(updatedSpot)
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
  return res.json({"message": "Successfully deleted"})
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
router.get('/', validateQuery, async (req, res, next) => {
  const options = queryFormatter(req.query)
  const spots = await Spot.findAll({
    where: options.where,
    limit: options.limit,
    offset: options.offset,
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
    Spots:spots,
    page: options.page,
    size: options.size
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

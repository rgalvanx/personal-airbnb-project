const express = require('express');
const router = express.Router();
const {Spot, User, SpotImage, Review} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
    .isFloat({min: .01}),
  handleValidationErrors
];

function previewImageFormatter(spot) {
    spot.dataValues.previewImage = spot.SpotImages[0].url
    delete spot.dataValues.SpotImages
    return spot;
}
function avgRatingFormatter(spot) {
    let sum = 0;
    let count = 0;
    spot.dataValues.Reviews.forEach((rev) => {
      count++
      sum+= rev.stars
    });
    if(count) {
      spot.dataValues.avgRating = sum/count;
    } else {
      spot.dataValues.avgRating = 0
    }
    delete spot.dataValues.Reviews;
    return spot
}
//Adds a image to a spot
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
      id
    },
    include: [{
      model: SpotImage,
        where: {
          preview: true
        }
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
  const spots = await Spot.findAll()
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

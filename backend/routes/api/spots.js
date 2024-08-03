const express = require('express');
const router = express.Router();
const {Spot, User} = require('../../db/models')
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

router.put('/:spotId', requireAuth, validateSpot, async(req, res, next) => {
  console.log(req.body)

  return res.json();
})

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll()
  return res.json({
    Spots:spots
  });
})

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

  return res.json(newSpot);
})

module.exports = router;

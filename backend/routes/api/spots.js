const express = require('express');
const router = express.Router();
const {Spot, User} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll()
  return res.json({
    Spots:spots
  });
})

router.post('/', requireAuth, async(req, res, next) => {
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

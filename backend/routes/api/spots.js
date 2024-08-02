const express = require('express');
const router = express.Router();
const {Spot} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll()
  return res.json({
    Spots:spots
  });
})

router.post('/', requireAuth, async(req, res, next) => {
  console.log('we mad it');
  res.json();
})

module.exports = router;

const express = require('express');
const router = express.Router();
const {Spot} = require('../../db/models')

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll()
  return res.json({
    Spots:spots
  });
})


module.exports = router;

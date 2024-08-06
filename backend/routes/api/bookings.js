const express = require('express');
const router = express.Router();
const {Spot, User, Review, ReviewImage, SpotImage, Booking} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {previewImageFormatter, avgRatingFormatter} = require('../../utils/formatters')

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId
        },
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', "address", "city", "state", "country", "lat", "lng", "name", "price"],
            include: {
                model: SpotImage,
            }
        }]
    })

    bookings.forEach((booking) => previewImageFormatter(booking.dataValues.Spot));
    return res.json({Bookings: bookings})
})


module.exports = router;

const express = require('express');
const router = express.Router();
const {Spot, User, Review, ReviewImage, SpotImage, Booking} = require('../../db/models')
const {requireAuth} = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {previewImageFormatter, avgRatingFormatter} = require('../../utils/formatters')
const { checkParams, bookingConflict, expiredBooking } = require('../../utils/bookingsValidators')


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

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if(!booking) {
        return res.status(404).json({"message": "Booking couldn't be found"})
    }
    if(userId !== booking.dataValues.userId) {
        return res.status(403).json({"message": "Forbidden"});
    }
    const errors = checkParams(startDate, endDate);
    if(errors.startDate || errors.endDate) {
      return res.status(400).json({
        'message': 'Bad Request',
        errors
      })
    }
    if(expiredBooking(booking.dataValues.endDate)) {
        return res.status(403).json({"message": "Past bookings can't be modified"})
    }
    const { spotId } = booking.dataValues;
    const spot = await Spot.findByPk(spotId, {
        include: [{
            model: Booking,
        }]
    });
    spot.dataValues.Bookings.forEach((booking) => {
        if(booking.id !== Number(bookingId)) {
            const errors = bookingConflict(startDate, endDate, booking.startDate, booking.endDate)
            if(errors.startDate || errors.endDate) {
                return res.status(403).json({
                  'message': "Sorry, this spot is already booked for the specified dates",
                  errors
                })
            }
        }
    })
    const newBooking = await booking.update(req.body)

    return res.json(newBooking)
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    if(!booking) {
        return res.status(404).json({"message": "Booking couldn't be found"})
    }
    if(userId !== booking.dataValues.userId) {
        return res.status(403).json({"message": "Forbidden"});
    }
    if(expiredBooking(booking.dataValues.startDate)) {
        return res.status(403).json({"message": "Bookings that have been started can't be deleted"})
    }
    await booking.destroy();

    return res.json({"message": "Successfully deleted"})
})

module.exports = router;

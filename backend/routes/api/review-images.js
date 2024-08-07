const express = require('express');
const router = express.Router();
const { Review, ReviewImage } = require('../../db/models');
const {requireAuth} = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const { imageId } = req.params;
    const userId = req.user.id;
    const image = await ReviewImage.findByPk(imageId, {
        include: [{
            model: Review
        }]
    })
    if(!image) {
        return res.status(404).json({"message": "Review Image couldn't be found"});
    }
    if(userId !== image.dataValues.Review.userId) {
        return res.status(403).json({"message": "Forbidden"})
    }
    await image.destroy();

    return res.json({"message": "Successfully deleted"})
})

module.exports = router;

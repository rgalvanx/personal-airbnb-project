const express = require('express');
const router = express.Router();
const { Spot, SpotImage } = require('../../db/models');
const {requireAuth} = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const userId = req.user.id
    const image = await SpotImage.findByPk(imageId, {
        include: [{
            model: Spot
        }]
    })
    if(!image) {
        return res.status(404).json({'message': "Spot Image couldn't be found"})
    }
    if(userId !== image.dataValues.Spot.ownerId) {
        return res.status(403).json({'message': 'Forbidden'});
    }
    let previewFlag = false;
    const spotId = image.dataValues.spotId
    if(image.preview = true) previewFlag = true;
    await image.destroy();
    if(previewFlag) {
        const newPreview = await SpotImage.findOne({
            where: { spotId }
        })

        if(newPreview) {
            newPreview.preview = true;
            await newPreview.save();
        }
    }

    return res.json({"message": "Successfully deleted"});
})

module.exports = router;

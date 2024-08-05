function previewImageFormatter(spot) {
  if(spot.dataValues.SpotImages.length === 0) {
    delete spot.dataValues.SpotImages
    return spot;
  }
  const image = spot.SpotImages.find(image => image.dataValues.preview === true)
  spot.dataValues.previewImage = image.url
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
    spot.dataValues.avgRating = 'no reviews yet'
  }
  delete spot.dataValues.Reviews;
  return spot
}

module.exports = {
  previewImageFormatter,
  avgRatingFormatter
}

const { Op } = require('sequelize')

function queryFormatter(query) {
    const options = {
        where: {}
    }
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;
    if(!page){
        page = 1
    } else {
        page = parseInt(page)
    }
    if(!size){
        size = 20
    } else {
        size = parseInt(size)
    }

    if(maxLat !== undefined) parseInt(maxLat);
    if(minLat !== undefined) parseInt(minLat);
    if(maxLat !== undefined && minLat !== undefined){
        options.where.lat = {[Op.between]: [minLat, maxLat]}
    } else if(minLat !== undefined) {
        options.where.lat = {[Op.gte]: minLat}
    } else if(maxLat !== undefined) {
        options.where.lat = {[Op.lte]: maxLat}
    }

    if(maxLng !== undefined) parseInt(maxLng);
    if(minLng !== undefined) parseInt(minLng);
    if(maxLng !== undefined && minLng !== undefined){
        options.where.lng = {[Op.between]: [minLng, maxLng]}
    } else if(minLng !== undefined) {
        options.where.lng = {[Op.gte]: minLng}
    } else if(maxLng !== undefined) {
        options.where.lng = {[Op.lte]: maxLng}
    }

    if(maxPrice !== undefined) parseInt(maxPrice);
    if(minPrice !== undefined) parseInt(minPrice);
    if(maxPrice !== undefined && minPrice !== undefined){
        options.where.price = {[Op.between]: [minPrice, maxPrice]}
    } else if(minPrice !== undefined) {
        options.where.price = {[Op.gte]: minPrice}
    } else if(maxPrice !== undefined) {
        options.where.price = {[Op.lte]: maxPrice}
    }

    options.limit = size;
    options.offset = size * (page - 1);
    return options;
}


module.exports = {queryFormatter};

function checkTodays(startDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    today.setUTCHours(0);
    const start = new Date(startDate);
    if(start >= today) {
        return false
    }
    return true
}

module.exports = {
    checkTodays
}

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

function checkStartEnd(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start >= end;
}

function bookingConflict(newStart, newEnd, currentStart, currentEnd) {
    const errors = {}
    if(newStart >= currentStart && newStart <= currentEnd) {
        errors.startDate = "Start date conflicts with an existing booking"
    }
    if(newEnd >= currentStart && newEnd <= currentEnd) {
        errors.endDate = "End date conflicts with an existing booking"
    }
    return errors
}

module.exports = {
    checkTodays,
    checkStartEnd,
    bookingConflict
}

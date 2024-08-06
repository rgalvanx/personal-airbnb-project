function checkParams(startDate, endDate) {
    const errors = {}
    const today = new Date();
    today.setHours(0,0,0,0);
    today.setUTCHours(0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    if(start <= today) {
        errors.startDate = 'startDate cannot be in the past'
    }
    if(start >= end) {
        errors.endDate = 'endDate cannot be on or before startDate'
    }
    return errors
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

function expiredBooking(endDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    today.setUTCHours(0);
    const end = new Date(endDate);
    return today > end;
}

module.exports = {
    bookingConflict,
    checkParams,
    expiredBooking
}

import { csrfFetch } from "./csrf";


const GET_ALL_REVIEWS = 'spot/GET_ALL_REVIEWS';
const CREATE_REVIEW = 'spot/CREATE_REVIEW';
const DELETE_REVIEW = 'spot/DELETE_REVIEW';

const getAllReviews = ( payload ) => {
    return {
        type: GET_ALL_REVIEWS,
        payload
    }
}

const createReview = ( payload ) => {
    return {
        type: CREATE_REVIEW,
        payload
    }
}

const deleteReview = ( payload ) => {
    return {
        type: DELETE_REVIEW,
        payload
    }
}

export const getAllReviewsThunk = ( spotId ) => async ( dispatch ) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if(res.ok) {
        const reviews = await res.json();
        dispatch(getAllReviews(reviews.Reviews))
        return reviews
    } else {
        const error = await res.json();
        return error;
    }
}

export const createReviewThunk = ( user, review, spotId ) => async ( dispatch ) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {'Content-Type': 'application/json'},
    })
    if(res.ok) {
        const createdReview = await res.json();
        createdReview.User = user
        dispatch(createReview(createdReview));
        return createdReview;
    } else {
        const error = await res.json();
        return error;
    }
}

export const deleteReviewThunk = ( reviewId ) => async ( dispatch ) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    })
    if(res.ok) {
        const deletedReview = await res.json();
        dispatch(deleteReview(reviewId))
        return deletedReview
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = {};

const reviewsReducer = ( state = initialState, action ) => {
    switch( action.type ) {
        case GET_ALL_REVIEWS: {
            const newState = { ...state }
            action.payload.forEach((review) => {
                newState[review.id] = review;
            })
            return newState;
        }
        case CREATE_REVIEW: {
            const newState = { ...state }
            newState[action.payload.id] = action.payload;
            return newState
        }
        case DELETE_REVIEW: {
            const newState = { ...state }
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
}

export default reviewsReducer;

import { csrfFetch } from './csrf';

const GET_ALL_SPOTS = 'spots/GET_All_SPOTS';
const GET_ONE_SPOT = 'spot/GET_ONE_SPOT';
const CREATE_SPOT = 'spot/CREATE_SPOT';
const UPDATE_SPOT = 'spot/UPDATE_SPOT';
const DELETE_SPOT = 'spot/DELETE_SPOT';

const getSpots = ( payload ) => {
    return {
        type: GET_ALL_SPOTS,
        payload
    }
}

const getOneSpot = ( payload ) => {
    return {
        type: GET_ONE_SPOT,
        payload
    }
}

const createSpot = ( payload ) => {
    return {
        type: CREATE_SPOT,
        payload
    }
}

const updateSpot = ( payload ) => {
    return {
        type: UPDATE_SPOT,
        payload
    }
}

const deleteSpot = ( payload ) => {
    return {
        type: DELETE_SPOT,
        payload
    }
}

export const loadAllSpotsThunk = () => async ( dispatch ) => {
    const res = await fetch('/api/spots');
    if(res.ok) {
        const spots = await res.json();
        dispatch(getSpots(spots.Spots));
        return spots;
    } else {
        const error = await res.json();
        return error;
    }
}

export const loadOneSpotThunk = ( spotId ) => async ( dispatch ) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if(res.ok) {
        const spot = await res.json();
        dispatch(getOneSpot(spot));
        return spot;
    } else {
        const error = await res.json();
        return error;
    }
}

export const createSpotThunk = ( spot ) => async ( dispatch ) => {
    const res = await csrfFetch('/api/spots', {
        method: "POST",
        body: JSON.stringify(spot),
        headers: {'Content-Type': 'application/json'}
    })
    if(res.ok) {
        const createdSpot = await res.json();
        dispatch(createSpot(createdSpot));
        return createdSpot
    }
}

export const updateSpotThunk = ( spotId, spot ) => async ( dispatch ) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify(spot),
        headers: {'Content-Type': 'application/json'}
    })
    if(res.ok) {
        const updatedSpot = await res.json();
        dispatch(updateSpot(updatedSpot));
        return updatedSpot;
    }
}

export const deleteSpotThunk = ( spotId ) => async ( dispatch ) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    })
    if(res.ok) {
        const deletedSpot = await res.json();
        dispatch(deleteSpot(spotId));
        return deletedSpot;
    }
}

const initialState = {};

const spotsReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ALL_SPOTS: {
            const newState = { ...state }
            action.payload.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState
        }
        case GET_ONE_SPOT: {
            const newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        case CREATE_SPOT: {
            const newState = { ...state }
            newState[action.payload.id] = { ...newState[action.payload.id], ...action.payload }
            return newState;
        }
        case UPDATE_SPOT: {
            const newState = { ...state }
            newState[action.payload.id] = { ...newState[action.payload.id], ...action.payload }
            return newState;
        }
        case DELETE_SPOT: {
            const newState = { ...state }
            delete newState[action.payload]
            return newState;
        }
        default:
            return state
    }
}

export default spotsReducer;

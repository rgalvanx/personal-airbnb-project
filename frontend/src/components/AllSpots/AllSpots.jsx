import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadAllSpotsThunk } from "../../store/spot";
import './AllSpots.css'

const AllSpots = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);
    const spotsArray = Object.values(spots).filter(spot => spot != undefined);

    useEffect(() => {
        dispatch(loadAllSpotsThunk());
    }, [dispatch]);

    if(!spots) return null;

    return spotsArray.map((spot) => (
        <div
        className="Spot_container"
        key={spot?.id}>
            <Link
            key={spot?.id}
            to={`/spots/${spot?.id}`}
            className="SPOTS"
            >
                <img src={spot.previewImage} alt={spot.name} />
                    <div className="idk">
                        <div className="allSpots_details">
                            <div>{spot.city}, {spot.state}</div>
                            <div>{spot.avgRating && spot.avgRating !== "No rating yet." ? spot.avgRating: "New"}
                            </div>
                            <span>${spot.price}</span><span>/night</span>

                        </div>
                    </div>
            </Link>
        </div>
    ))
}

export default AllSpots;

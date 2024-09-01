import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { loadAllSpotsThunk } from "../../store/spot";
import { FaStar } from "react-icons/fa";
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
                <img src={spot.previewImage} alt={spot.name}></img>
                    <div className="this_spot_details">
                        <div className="allSpots_details">
                            <div>{spot.city}, {spot.state}</div>
                            <div><FaStar />{spot.avgRating && spot.avgRating !== "no current reviews" ? spot.avgRating: "New"}</div>
                        </div>
                        <div className="this_spot_price">
                            <span>${spot.price}</span><span>/night</span>
                        </div>
                    </div>
            </Link>
        </div>
    ))
}

export default AllSpots;

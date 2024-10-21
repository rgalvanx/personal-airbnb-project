import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadAllSpotsThunk } from "../../store/spot";
import { FaStar } from "react-icons/fa";
import './AllSpots.css'

const AllSpots = () => {
    const dispatch = useDispatch();
    const [ toolTip, setToolTip ] = useState(null);
    const spots = useSelector(state => state.spots);
    const spotsArray = Object.values(spots).filter(spot => spot != undefined);

    useEffect(() => {
        dispatch(loadAllSpotsThunk());
    }, [dispatch]);

    if(!spots) return null;

    return spotsArray.map((spot) => (
        <div
        className="Spot_container"
        value={toolTip}
        onMouseOut={() => setToolTip(null)}
        onMouseOver={() => setToolTip(spot.id)}
        key={spot?.id}
        title={`${spot.name}`}>
            <Link
            key={spot?.id}
            to={`/spots/${spot?.id}`}
            className="SPOTS"
            >
                {/* <span className="tool_tip_text">{spot.name}</span> */}
                {toolTip === spot.id ? <h4 className="toolTip">{spot.name}</h4> : <h3 className="no-show"></h3>}
                <img src={spot.previewImage} alt={spot.name}></img>
                    <div className="this_spot_details">
                        <div className="allSpots_details">
                            <div>{spot.city}, {spot.state}</div>
                            <div>${spot.price} night</div>
                        </div>
                        <div className="this_spot_price">
                            <span><FaStar />{spot.avgRating && spot.avgRating !== "no current reviews" ? spot.avgRating: "New"}</span>
                        </div>
                    </div>
            </Link>
        </div>
    ))
}

export default AllSpots;

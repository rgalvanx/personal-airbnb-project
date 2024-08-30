import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpotThunk } from "../../store/spot";
import './SpotDetail.css'

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(( state ) => state.spots[spotId]);

    useEffect(() => {
        dispatch(loadOneSpotThunk(spotId))
        //console.log('here)
    }, [dispatch, spotId]);

    if(!spot || !spot.Owner ) return null;

    const handleReservation = () => {
        alert('feature coming soon')
    }
    console.log(spot)

    return (
        <div className="">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            <div className="spot_images">
                {spot.SpotImages && spot.SpotImages.length > 0 && (
                    <>
                        <div className='all_images' style={{width: 200, height: 200}}>
                            <img className='preview_image' src={spot.SpotImages[0].url} style={{width: 200, height: 200}}/>
                        </div>
                    </>
                )}
            </div>
            <div className="spot_info">
                <div className="spot_owner">
                    <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
                </div>
                <div className="spot_description">
                    <p>{spot.description}</p>
                </div>
                <div className="spot_reservation">
                    <div className='spot_price'>
                        <p>{spot.price}/night</p>
                    </div>
                    <div className="spot_rating">
                        {spot.avgRating} Stars
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SpotDetail;

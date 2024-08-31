import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpotThunk } from "../../store/spot";
import './SpotDetail.css'

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    const sessionUser = useSelector(state => state.session.user)

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
        <div className="spot_details">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            <div className="spot_images">
                {spot.SpotImages && spot.SpotImages.length > 0 && (
                    <>
                        <div className='all_images' style={{width: 600, height: 600}}>
                            <div className='preview_image' >
                            <img className='previewImg' src={spot.SpotImages[0].url } />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="spot_info">
                <div className="spot_owner">
                    <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
                    <p>{spot.description}</p>
                        <p>{spot.price}/night</p>
                        {spot.avgRating} Stars
                </div>
                {/* <div className="">
                </div>
                <div className="spot_reservation">
                    <div className="">
                    </div>
                    <div className="spot_rating">
                    </div>
                </div> */}
                <button className='reserve_button' onClick={handleReservation}>Reserve</button>

            </div>
            {user && !spot.Reviews?.filter((review) => review.userId == id) }
        </div>
    )
}

export default SpotDetail;

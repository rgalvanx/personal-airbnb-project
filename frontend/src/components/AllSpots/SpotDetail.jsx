import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpotThunk } from "../../store/spot";
import './SpotDetail.css'
import { FaStar } from "react-icons/fa";
import { getAllReviewsThunk } from "../../store/review";
import AddReviewModal from "../AddReviewModal/AddReviewModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    const sessionUser = useSelector(state => state.session);
    const reviews = useSelector(state =>
        Object.values(state.reviews).filter(review => review.spotId === +spotId)
    );

    console.log('_________', sessionUser.user.id)

    useEffect(() => {
        dispatch(loadOneSpotThunk(spotId))
        dispatch(getAllReviewsThunk(spotId))
        //console.log('here)
    }, [dispatch, spotId]);

    // console.log('yesssssss', spot)
    console.log('----------', reviews)


    if(!spot || !spot.Owner || !spot.SpotImages) return null;

    const handleReservation = () => {
        alert('feature coming soon')
    }
    // console.log('hellooooooo', spot)

    return (
        <div className="spot_details">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>

                {spot.SpotImages && spot.SpotImages.length > 0 && (
                    <>
                        <div className='all_images'>
                            <div className='preview_image' >
                            <img className='previewImg' src={spot.SpotImages[0].url } />
                            </div>
                            <div className="rest_images">
                            {spot.SpotImages.filter(image => image.preview === false).map((image) => (

                                <div className='spot_detail_images' key={image.id}>
                                    <img src={image.url} alt={image.id} />
                                </div>
                            ))}
                            </div>
                        </div>
                    </>
                )}

            <div className="spot_info">
                <div className="spot_owner">
                    <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
                    <p>{spot.description}</p>
                </div>
                {/* <div className="">
                </div>
                <div className="spot_reservation">
                <div className="">
                </div>
                <div className="spot_rating">
                </div>
                </div> */}
                <div className="reserve_box">
                    <p className='spot_reserve_price'>{spot.price}$ night </p>
                <button className='reserve_button' onClick={handleReservation}>Reserve</button>
                    <p className='rating_reservation'> <FaStar></FaStar>{!spot.numReviews ? "NEW": <>{spot.avgRating} · {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}</>}</p>
                </div>

            </div>
            <div>
                <div className="review_container">
                    <h3><FaStar /> {!spot.numReviews ? "NEW": <>{spot.avgRating} · {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}</>}</h3>
                    {sessionUser.user && sessionUser.user.id !== spot.OwnerId && spot.numReviews === 0 && <p>Be the first to post a review!</p>}
                    {/* {sessionUser.user && sessionUser.user.id !== spot.OwnerId && } */}
                <div className="spot_reviews">
                    {sessionUser.user && sessionUser.user.id !== spot.OwnerId && <button><OpenModalMenuItem modalComponent={<AddReviewModal />} itemText={'Post Your Review'} /></button>}
                    <div className="all_reviews">{reviews.map((review) => {
                        return (
                            <div className='each_review' key={review.id}>
                                <h3>{review.User.firstName}</h3>
                                <h5></h5>
                                <p>{review.review}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
</div>
    )
}

export default SpotDetail;

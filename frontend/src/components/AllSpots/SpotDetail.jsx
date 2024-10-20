import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadOneSpotThunk } from "../../store/spot";
import './SpotDetail.css'
import { FaStar } from "react-icons/fa";
import { getAllReviewsThunk } from "../../store/review";
import AddReviewModal from "../AddReviewModal/AddReviewModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmDeleteReviewModal from "../ConfirmDeleteReviewModal/ConfirmDeleteReviewModal";


const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    const sessionUser = useSelector(state => state.session);
    const reviews = useSelector(state => Object.values(state.reviews).filter(review => review.spotId === +spotId));
    const sorted = reviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(loadOneSpotThunk(spotId))
        dispatch(getAllReviewsThunk(spotId))
    }, [dispatch, spotId]);


    if(!spot || !spot.Owner ) return null;

    const handleReservation = () => {
        alert('feature coming soon')
    }

    const roundUp = Math.round(spot.avgRating * 100) / 100

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
                <div className="reserve_box">
                    <p className='spot_reserve_price'>{spot.price}$ night </p>
                <button className='reserve_button' onClick={handleReservation}>Reserve</button>
                    <p className='rating_reservation'> <FaStar></FaStar>{!spot.numReviews ? "NEW": <>{roundUp} · {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}</>}</p>
                </div>

            </div>
            <div>
                <div className="review_container">
                    <h3><FaStar /> {!spot.numReviews ? "NEW": <>{roundUp} · {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}</>}</h3>
                    {sessionUser.user && sessionUser.user.id !== spot.ownerId && spot.numReviews === 0 && <p>Be the first to post a review!</p>}
                <div className="spot_reviews">
                    {sessionUser.user && sessionUser.user.id !== spot.ownerId &&
                    !reviews.filter(review => review.userId === sessionUser.user.id).length > 0 &&
                    <button><OpenModalMenuItem modalComponent={<AddReviewModal navigate={navigate} spotId={spotId}/>} itemText={'Post Your Review'} /></button>}
                    <div className="all_reviews">{sorted.map((review) => {
                        const date = new Date(review.updatedAt);
                        const newDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
                        return (
                            <div className='each_review' key={review.id}>
                                <h3>{review.User.firstName}</h3>
                                <p>{newDate}</p>
                                <p>{review.review}</p>
                                {sessionUser.user && sessionUser.user.id === review.User.id && <button><OpenModalMenuItem modalComponent={<ConfirmDeleteReviewModal navigate={navigate} reviewId={review.id} spotId={spotId} deleteType={'Review'}/>}itemText={'Delete'}/></button>}
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

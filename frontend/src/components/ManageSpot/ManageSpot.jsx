import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { loadAllSpotsThunk } from "../../store/spot";
// import { useModal } from "../../context/Modal";
import { FaStar } from "react-icons/fa";
// import ConfirmDeleteSpotModal from "../ConfirmDeleteSpotModal/ConfirmDeleteSpotModal";
import { getAllReviewsThunk } from "../../store/review";
import './ManageSpot.css'

const ManageSpot = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const { closeModal } = useModal();
    const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots)
    const usersSpots = Object.values(spots).filter(spot => spot.ownerId === sessionUser.id);
    const reviews = useSelector(state => Object.values(state.reviews))
    const betterReviews = Object.values(reviews).filter(review => review.ownerId === sessionUser.id);
    // const reviews = useSelector(state =>
    //     Object.values(state.reviews).filter(review => review.spotId === +spotId)
    // );
    console.log('yesssssssir', spots)
    console.log('noooooooo', sessionUser.id)
    console.log('oookkkkkkk', reviews)
    console.log('Hellooooooooo', betterReviews)

    useEffect(() => {
        dispatch(loadAllSpotsThunk());
        dispatch(getAllReviewsThunk())
    }, [dispatch])

    // const deleteSpot = async ( spotId ) => {
    //     await dispatch(deleteSpotThunk( spotId ));
    //     closeModal();
    // }

    return (
        <div className="main_manage">
            <h1 className="manage_title">Manage Spots</h1>
            <button className="create_spot_button"><Link to={'/spots/new'}>Create a New Spot!</Link></button>
            <div className="manage_container">
                {usersSpots.map((spot) => (
                    <div className="manage_spots_container" key={spot.id}>
                        <Link style={{width: 'fit-content'}} key={spot.id} to={`/spots/${spot.id}`}>
                        <img src={spot.previewImage} />
                        <div className="bottom_manage">
                            <div className="manage_spot_description">
                                <span>{spot.city}, {spot.state}</span>
                                <span>${spot.price}/night</span>
                            </div>
                            <div className="manage_spot_rating">
                                <span><FaStar />{spot.avgRating && spot.avgRating !== "no current reviews" ? spot.avgRating : "NEW" }</span>
                            </div>
                        </div>
                        </Link>
                        <div className="manage_confirm_buttons">
                            <button><Link to={`/spots/${spot.id}/edit`}>Update</Link></button>
                            <button>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageSpot;

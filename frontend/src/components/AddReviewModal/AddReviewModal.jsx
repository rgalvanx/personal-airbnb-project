import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store/review";
import './AddReviewModal.css';
import { FaStar } from "react-icons/fa";

function AddReviewModal({ spotId, reviewSubmission }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [ review, setReview ] = useState('');
    // const [ stars ] = useState(0);
    const [ setErrors ] = useState({})
    // const spot = useSelector(state => state.spot)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = { review };
        await dispatch(createReviewThunk( newReview, spotId ));
        if(reviewSubmission) {
            reviewSubmission();
        }
        closeModal();
    }

    useEffect(() => {
        const errors = {}

        if(review.length < 5) errors.review = 'Review must be at least 5 characters long';
        setErrors(errors)
    }, [review ])

    return (
        <form
        onSubmit={handleSubmit}
        className="review_form"
        >
            <h3 className="top_modal">How was your stay?</h3>
            <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="bottom_modal"
            ></textarea>
            <div className="review_stars">
                <FaStar className="actual_stars"/>
                <FaStar className="actual_stars"/>
                <FaStar className="actual_stars"/>
                <FaStar className="actual_stars"/>
                <FaStar className="actual_stars"/>
                <span className="star">Stars</span>
            </div>
            <div className="submit_review">
                <button className="submit_review">Submit Review</button>
            </div>
        </form>
    )
}

export default AddReviewModal;

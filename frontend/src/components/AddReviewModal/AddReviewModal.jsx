import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store/review";
import './AddReviewModal.css';
import { FaStar } from "react-icons/fa";

function AddReviewModal({ spotId, setNewReview }) {

    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session)
    const { closeModal } = useModal();
    const [ review, setReview ] = useState('');
    const [ stars, setStars ] = useState(0);
    const [ rating, setRating] = useState(0);
    const [ errors, setErrors ] = useState({})
    const [ submission, setSubmission ] = useState(false)


    const handleSubmit = async () => {
        e.preventDefault();
        setErrors({});
        setSubmission(true);
        if(Object.values(errors).length) {
            return;
        }
        const newReview = { review, stars };
        await dispatch(createReviewThunk(spotId));
        setNewReview((prev) => prev + 1)
        closeModal();
    }
    console.log(review)

    useEffect(() => {
        const errors = {}
        if(review.length < 5) errors.review = 'Review must be at least 5 characters long';
        if(stars < 1) errors.stars = 'Stars must be greater than 1';
        setErrors(errors)
    }, [ stars, review ])

    return (
        <form
        className="review_form"
        onSubmit={handleSubmit}
        >
            <h3 className="top_modal">How was your stay?</h3>
            <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="bottom_modal"
            ></textarea>
            <div className="review_stars">
                <FaStar onMouseEnter={() => (setRating(1))} onMouseLeave={() => (setRating(stars))} onClick={() => setStars(1)} className={stars > 0 || rating > 0 ? 'filled' : 'empty'}/>
                <FaStar onMouseEnter={() => (setRating(2))} onMouseLeave={() => (setRating(stars))} onClick={() => setStars(2)} className={stars > 1 || rating > 1 ? 'filled' : 'empty'}/>
                <FaStar onMouseEnter={() => (setRating(3))} onMouseLeave={() => (setRating(stars))} onClick={() => setStars(3)} className={stars > 2 || rating > 2 ? 'filled' : 'empty'}/>
                <FaStar onMouseEnter={() => (setRating(4))} onMouseLeave={() => (setRating(stars))} onClick={() => setStars(4)} className={stars > 3 || rating > 3 ? 'filled' : 'empty'}/>
                <FaStar onMouseEnter={() => (setRating(5))} onMouseLeave={() => (setRating(stars))} onClick={() => setStars(5)} className={stars > 4 || rating > 4 ? 'filled' : 'empty'}/>
                <span className="stars">Stars</span>
            </div>
            <div className="submit_review">
                <button disabled={review.length < 10 || stars < 1}className="submit_review">Submit Review</button>
                {submission && errors.review && <p className="errors">{errors.review}</p>}
                {submission && errors.stars && <p className="errors">{errors.stars}</p>}
            </div>
        </form>
    )
}

export default AddReviewModal;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store/review";
import './AddReviewModal.css';

function AddReviewModal({ spotId, reviewSubmission }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [ review, setReview ] = useState('');
    const [ stars ] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = { review, stars };
        await dispatch(createReviewThunk( newReview, spotId ));
        if(reviewSubmission) {
            reviewSubmission();
        }
        closeModal();
    }

    return (
        <form
        onSubmit={handleSubmit}
        className="form"
        >
            <h3>How was your stay?</h3>
            <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            ></textarea>
        </form>
    )
}

export default AddReviewModal;

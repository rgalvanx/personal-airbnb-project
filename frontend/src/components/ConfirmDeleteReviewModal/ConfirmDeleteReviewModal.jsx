import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/review";
import { useDispatch } from "react-redux";
import './ConfirmDeleteReviewModal.css';

function ConfirmDeleteReviewModal({ reviewId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const deleteSpot = async () => {
        await dispatch(deleteReviewThunk(reviewId))
        .then(closeModal)
    }

    return (
        <div className="delete_spot_modal">
            <h1 className="confirm_delete_title">Confirm Delete</h1>
            <div className="subtitle">
                <p className="confirmation_note">Are you sure you want to delete this review?</p>
            </div>
            <div className="buttons">
                <button className="yes_button" onClick={deleteSpot}>Yes (Delete Review)</button>
                <button className='no_button' onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteReviewModal;

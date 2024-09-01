import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spot";
import { useDispatch } from "react-redux";
import './ConfirmDeleteSpotModal.css';

function ConfirmDeleteSpotModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const deleteSpot = async () => {
        await dispatch(deleteSpotThunk(spotId))
        .then(closeModal)
    }

    return (
        <div className="delete_spot_modal">
            <h1>Confirm Delete</h1>
            <div>
                <p className="confirmation_note">Are you sure you want to remove this spot from the listings?</p>
            </div>
            <div className="buttons">
                <button className="yes_button" onClick={deleteSpot}>Yes (Delete Spot)</button>
                <button className='no_button' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteSpotModal;
